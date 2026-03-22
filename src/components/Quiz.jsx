import { useState, useCallback, useRef, useEffect } from 'react';
import flags, { getFlagUrl } from '../data/flags';
import similarPairs from '../data/similarPairs';

const QUIZ_MODES = [
  { id: 'flag-to-name', label: '🏳️ Flag → Name', desc: 'See a flag, pick the country' },
  { id: 'name-to-flag', label: '📝 Name → Flag', desc: 'See a name, pick the flag' },
  { id: 'colors-quiz', label: '🎨 Color Quiz', desc: 'Which flag has these colors?' },
  { id: 'continent-quiz', label: '🌍 Continent Quiz', desc: 'Which continent is this flag from?' },
  { id: 'similar-quiz', label: '🔀 Similar Flags', desc: 'Can you tell look-alikes apart?' },
];

const DIFFICULTIES = [
  { id: 1, label: 'Easy', emoji: '🟢', count: 'Basic flags' },
  { id: 2, label: 'Medium', emoji: '🟡', count: 'More flags' },
  { id: 3, label: 'Hard', emoji: '🔴', count: 'All flags' },
];

function getVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
    voices.find(v => v.lang.startsWith('en'));
}

function speak(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  const voice = getVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function speakOptionOnly(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  const voice = getVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestion(mode, difficulty) {
  // Similar flags quiz - special generation
  if (mode === 'similar-quiz') {
    const pair = similarPairs[Math.floor(Math.random() * similarPairs.length)];
    const answerIdx = Math.random() < 0.5 ? 0 : 1;
    const answerCode = pair.flags[answerIdx];
    const wrongCode = pair.flags[1 - answerIdx];
    const answer = flags.find(f => f.code === answerCode);
    const wrong = flags.find(f => f.code === wrongCode);
    if (!answer || !wrong) return generateQuestion('flag-to-name', difficulty);

    // Add 2 more random wrong options for variety
    const otherPool = flags.filter(f => f.code !== answerCode && f.code !== wrongCode);
    const extraWrong = shuffle(otherPool).slice(0, 2);
    const options = shuffle([answer, wrong, ...extraWrong]);

    return { answer, options, mode, pairInfo: pair };
  }

  const pool = flags.filter((f) => f.difficulty <= difficulty);
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const otherPool = pool.filter((f) => f.code !== answer.code);

  let wrongAnswers;
  if (mode === 'continent-quiz') {
    const continents = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
    const otherContinents = continents.filter((c) => c !== answer.continent);
    wrongAnswers = shuffle(otherContinents).slice(0, 3).map((c) => ({ name: c, continent: c }));
  } else {
    wrongAnswers = shuffle(otherPool).slice(0, 3);
  }

  const options = shuffle([
    ...(mode === 'continent-quiz'
      ? [{ name: answer.continent, continent: answer.continent, code: answer.code }]
      : [answer]),
    ...wrongAnswers,
  ]);

  return { answer, options, mode };
}

export default function Quiz({ setScore, onSelectFlag }) {
  const [mode, setMode] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questionNum, setQuestionNum] = useState(0);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [showSummary, setShowSummary] = useState(false);
  const [animation, setAnimation] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const timerRef = useRef(null);
  const hoverTimerRef = useRef(null);

  const TOTAL_QUESTIONS = 10;

  const effectiveDifficulty = mode === 'similar-quiz' ? 3 : difficulty;

  const speakQuestion = (q) => {
    if (q.mode === 'flag-to-name') {
      speak('Which country does this flag belong to?');
    } else if (q.mode === 'name-to-flag' || q.mode === 'similar-quiz') {
      speak(`Which flag belongs to ${q.answer.name}?`);
    } else if (q.mode === 'colors-quiz') {
      speak(`Which flag has the colors ${q.answer.colors.join(', ')}?`);
    } else if (q.mode === 'continent-quiz') {
      speak('Which continent is this flag from?');
    }
  };

  const enableHoverAfterDelay = () => {
    setHoverEnabled(false);
    setHoveredIdx(-1);
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setHoverEnabled(true), 2500);
  };

  const nextQuestion = useCallback(() => {
    if (questionNum >= TOTAL_QUESTIONS) {
      setShowSummary(true);
      return;
    }
    setSelected(null);
    setShowResult(false);
    setAnimation('slide-in');
    const q = generateQuestion(mode, effectiveDifficulty);
    setQuestion(q);
    setQuestionNum((n) => n + 1);
    speakQuestion(q);
    enableHoverAfterDelay();
    setTimeout(() => setAnimation(''), 400);
  }, [mode, effectiveDifficulty, questionNum]);

  const startQuiz = useCallback((selectedMode, selectedDifficulty) => {
    const diff = selectedMode === 'similar-quiz' ? 3 : selectedDifficulty;
    const q = generateQuestion(selectedMode, diff);
    setQuestion(q);
    setQuestionNum(1);
    setAnimation('slide-in');
    speakQuestion(q);
    enableHoverAfterDelay();
    setTimeout(() => setAnimation(''), 400);
  }, []);

  const getOptionLabel = (opt) => {
    if (mode === 'continent-quiz') return opt.continent;
    return opt.name;
  };

  const handleOptionHover = (opt, idx) => {
    if (showResult || !hoverEnabled) return;
    setHoveredIdx(idx);
    speakOptionOnly(getOptionLabel(opt));
  };

  const handleOptionTouch = (opt, idx) => {
    if (showResult) return;
    setHoveredIdx(idx);
    speakOptionOnly(getOptionLabel(opt));
  };

  // Keyboard navigation
  useEffect(() => {
    if (!question || showResult) return;
    const handleKey = (e) => {
      const opts = question.options;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = hoveredIdx < opts.length - 1 ? hoveredIdx + 1 : 0;
        setHoveredIdx(next);
        speakOptionOnly(getOptionLabel(opts[next]));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = hoveredIdx > 0 ? hoveredIdx - 1 : opts.length - 1;
        setHoveredIdx(prev);
        speakOptionOnly(getOptionLabel(opts[prev]));
      } else if (e.key === 'Enter' && hoveredIdx >= 0) {
        e.preventDefault();
        handleAnswer(opts[hoveredIdx]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [question, showResult, hoveredIdx, mode]);

  const handleAnswer = (option) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    setHoverEnabled(false);

    const isCorrect =
      mode === 'continent-quiz'
        ? option.continent === question.answer.continent
        : option.code === question.answer.code;

    setSessionScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));

    setScore((prev) => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const earnedStars = isCorrect && newStreak > 0 && newStreak % 3 === 0 ? 1 : 0;
      return {
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        stars: prev.stars + (isCorrect ? 1 : 0) + earnedStars,
      };
    });

    if (isCorrect) {
      speak(`${question.answer.name}. Correct! Well done!`);
    } else {
      speak(`It was ${question.answer.name}. Try again next time!`);
    }

    setAnimation(isCorrect ? 'correct-bounce' : 'wrong-shake');

    timerRef.current = setTimeout(() => {
      if (questionNum >= TOTAL_QUESTIONS) {
        setShowSummary(true);
      } else {
        nextQuestion();
      }
    }, 3500);
  };

  const resetQuiz = () => {
    window.speechSynthesis.cancel();
    clearTimeout(timerRef.current);
    clearTimeout(hoverTimerRef.current);
    setMode(null);
    setDifficulty(null);
    setQuestion(null);
    setSelected(null);
    setShowResult(false);
    setQuestionNum(0);
    setSessionScore({ correct: 0, total: 0 });
    setShowSummary(false);
    setAnimation('');
    setHoveredIdx(-1);
    setHoverEnabled(false);
  };

  // Mode selection
  if (!mode) {
    return (
      <div className="quiz-page">
        <h2>🎯 Choose Quiz Mode</h2>
        <p className="quiz-subtitle">Pick how you want to be tested!</p>
        <div className="mode-grid">
          {QUIZ_MODES.map((m) => (
            <button key={m.id} className="mode-card" onClick={() => {
              setMode(m.id);
              if (m.id === 'similar-quiz') {
                setDifficulty(3);
                startQuiz(m.id, 3);
              }
            }}>
              <span className="mode-icon">{m.label.split(' ')[0]}</span>
              <strong>{m.label.split(' ').slice(1).join(' ')}</strong>
              <small>{m.desc}</small>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Difficulty selection (similar-quiz skips this)
  if (!difficulty && mode !== 'similar-quiz') {
    return (
      <div className="quiz-page">
        <h2>⚡ Choose Difficulty</h2>
        <p className="quiz-subtitle">How hard do you want it?</p>
        <div className="difficulty-grid">
          {DIFFICULTIES.map((d) => (
            <button key={d.id} className="difficulty-card" onClick={() => {
              setDifficulty(d.id);
              startQuiz(mode, d.id);
            }}>
              <span className="diff-emoji">{d.emoji}</span>
              <strong>{d.label}</strong>
              <small>{d.count}</small>
            </button>
          ))}
        </div>
        <button className="back-btn" onClick={resetQuiz}>← Back</button>
      </div>
    );
  }

  // Summary
  if (showSummary) {
    const pct = Math.round((sessionScore.correct / sessionScore.total) * 100);
    let medal = '🥉';
    let message = 'Keep practicing!';
    if (pct >= 90) { medal = '🏆'; message = 'Amazing! You\'re a flag master!'; }
    else if (pct >= 70) { medal = '🥇'; message = 'Great job! Almost perfect!'; }
    else if (pct >= 50) { medal = '🥈'; message = 'Good effort! Keep learning!'; }

    return (
      <div className="quiz-page">
        <div className="summary-card">
          <span className="summary-medal">{medal}</span>
          <h2>Quiz Complete!</h2>
          <p className="summary-message">{message}</p>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-big">{sessionScore.correct}/{sessionScore.total}</span>
              <span>Correct</span>
            </div>
            <div className="summary-stat">
              <span className="stat-big">{pct}%</span>
              <span>Accuracy</span>
            </div>
            <div className="summary-stat">
              <span className="stat-big">⭐ {sessionScore.correct}</span>
              <span>Stars Earned</span>
            </div>
          </div>
          <div className="summary-actions">
            <button className="play-again-btn" onClick={resetQuiz}>🔄 Play Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const isCorrect = (option) => {
    if (mode === 'continent-quiz') return option.continent === question.answer.continent;
    return option.code === question.answer.code;
  };

  const getOptionClass = (option, idx) => {
    let cls = '';
    if (idx === hoveredIdx && !showResult) cls += ' hovered';
    if (!showResult) return cls;
    if (isCorrect(option)) return cls + ' correct';
    if (selected && option.code === selected.code && !isCorrect(option)) return cls + ' wrong';
    return cls + ' dimmed';
  };

  return (
    <div className="quiz-page">
      <div className="quiz-top-bar">
        <button className="quit-btn" onClick={resetQuiz}>✕ Quit</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(questionNum / TOTAL_QUESTIONS) * 100}%` }} />
        </div>
        <span className="question-counter">{questionNum}/{TOTAL_QUESTIONS}</span>
      </div>

      <div className={`quiz-question ${animation}`}>
        {/* Flag to Name */}
        {mode === 'flag-to-name' && (
          <>
            <h3>Which country does this flag belong to?</h3>
            <div className="quiz-flag-display">
              <img src={getFlagUrl(question.answer.code)} alt="Mystery flag" />
            </div>
            <div className="quiz-options">
              {question.options.map((opt, idx) => (
                <button
                  key={opt.code}
                  className={`quiz-option text-option ${getOptionClass(opt, idx)}`}
                  onClick={() => handleAnswer(opt)}
                  onMouseEnter={() => handleOptionHover(opt, idx)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                  onTouchStart={() => handleOptionTouch(opt, idx)}
                  disabled={showResult}
                >
                  {opt.name}
                  {showResult && isCorrect(opt) && ' ✓'}
                  {showResult && selected?.code === opt.code && !isCorrect(opt) && ' ✗'}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Name to Flag */}
        {mode === 'name-to-flag' && (
          <>
            <h3>Which flag belongs to <strong>{question.answer.name}</strong>?</h3>
            <div className="quiz-options flag-options">
              {question.options.map((opt, idx) => (
                <button
                  key={opt.code}
                  className={`quiz-option flag-option ${getOptionClass(opt, idx)}`}
                  onClick={() => handleAnswer(opt)}
                  onMouseEnter={() => handleOptionHover(opt, idx)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                  onTouchStart={() => handleOptionTouch(opt, idx)}
                  disabled={showResult}
                >
                  <img src={getFlagUrl(opt.code, 160)} alt={`Option`} />
                  {showResult && <span className="flag-option-label">{opt.name}</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Colors Quiz */}
        {mode === 'colors-quiz' && (
          <>
            <h3>Which flag has these colors?</h3>
            <div className="colors-display">
              {question.answer.colors.map((c) => (
                <span
                  key={c}
                  className="color-swatch"
                  style={{ backgroundColor: c.toLowerCase() === 'gold' ? '#FFD700' : c.toLowerCase() }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="quiz-options flag-options">
              {question.options.map((opt, idx) => (
                <button
                  key={opt.code}
                  className={`quiz-option flag-option ${getOptionClass(opt, idx)}`}
                  onClick={() => handleAnswer(opt)}
                  onMouseEnter={() => handleOptionHover(opt, idx)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                  onTouchStart={() => handleOptionTouch(opt, idx)}
                  disabled={showResult}
                >
                  <img src={getFlagUrl(opt.code, 160)} alt="Option" />
                  {showResult && <span className="flag-option-label">{opt.name}</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Similar Flags Quiz */}
        {mode === 'similar-quiz' && (
          <>
            <h3>Which flag belongs to <strong>{question.answer.name}</strong>?</h3>
            {question.pairInfo && (
              <p className="similar-quiz-hint">⚠️ Watch out — one of these is a look-alike!</p>
            )}
            <div className="quiz-options flag-options">
              {question.options.map((opt, idx) => (
                <button
                  key={opt.code}
                  className={`quiz-option flag-option ${getOptionClass(opt, idx)}`}
                  onClick={() => handleAnswer(opt)}
                  onMouseEnter={() => handleOptionHover(opt, idx)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                  onTouchStart={() => handleOptionTouch(opt, idx)}
                  disabled={showResult}
                >
                  <img src={getFlagUrl(opt.code, 160)} alt="Option" />
                  {showResult && <span className="flag-option-label">{opt.name}</span>}
                </button>
              ))}
            </div>
            {showResult && question.pairInfo && !isCorrect(selected) && (
              <div className="similar-quiz-tip">
                💡 <strong>Tip:</strong> {question.pairInfo.quickTip}
              </div>
            )}
          </>
        )}

        {/* Continent Quiz */}
        {mode === 'continent-quiz' && (
          <>
            <h3>Which continent is this flag from?</h3>
            <div className="quiz-flag-display">
              <img src={getFlagUrl(question.answer.code)} alt="Mystery flag" />
            </div>
            <div className="quiz-options">
              {question.options.map((opt, idx) => (
                <button
                  key={opt.continent + idx}
                  className={`quiz-option text-option ${getOptionClass(opt, idx)}`}
                  onClick={() => handleAnswer(opt)}
                  onMouseEnter={() => handleOptionHover(opt, idx)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                  onTouchStart={() => handleOptionTouch(opt, idx)}
                  disabled={showResult}
                >
                  {opt.continent === 'Asia' && '🌏 '}
                  {opt.continent === 'Europe' && '🌍 '}
                  {opt.continent === 'Americas' && '🌎 '}
                  {opt.continent === 'Africa' && '🌍 '}
                  {opt.continent === 'Oceania' && '🌊 '}
                  {opt.continent}
                  {showResult && isCorrect(opt) && ' ✓'}
                </button>
              ))}
            </div>
          </>
        )}

        {showResult && (
          <div className={`result-banner ${isCorrect(selected) ? 'correct' : 'wrong'}`}>
            {isCorrect(selected) ? (
              <span>🎉 Correct! +1 ⭐</span>
            ) : (
              <span>
                ❌ It was <strong>{question.answer.name}</strong>
                <button className="learn-more-btn" onClick={() => onSelectFlag(question.answer)}>
                  📖 Learn about it
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
