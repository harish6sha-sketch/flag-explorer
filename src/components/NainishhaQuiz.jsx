import { useState, useCallback, useRef, useEffect } from 'react';
import { getFlagUrl } from '../data/flags';

const QUIZ_FLAGS = [
  { name: "China", code: "cn", continent: "Asia", colors: ["Red", "Yellow"] },
  { name: "India", code: "in", continent: "Asia", colors: ["Orange", "White", "Green", "Blue"] },
  { name: "Mexico", code: "mx", continent: "Americas", colors: ["Green", "White", "Red"] },
  { name: "Japan", code: "jp", continent: "Asia", colors: ["White", "Red"] },
  { name: "United States", code: "us", continent: "Americas", colors: ["Red", "White", "Blue"] },
  { name: "Bahrain", code: "bh", continent: "Asia", colors: ["Red", "White"] },
  { name: "Qatar", code: "qa", continent: "Asia", colors: ["Maroon", "White"] },
  { name: "Bangladesh", code: "bd", continent: "Asia", colors: ["Green", "Red"] },
  { name: "Bhutan", code: "bt", continent: "Asia", colors: ["Orange", "Yellow", "White"] },
  { name: "Sri Lanka", code: "lk", continent: "Asia", colors: ["Yellow", "Maroon", "Green", "Orange"] },
  { name: "Pakistan", code: "pk", continent: "Asia", colors: ["Green", "White"] },
  { name: "Nepal", code: "np", continent: "Asia", colors: ["Red", "Blue", "White"] },
  { name: "Germany", code: "de", continent: "Europe", colors: ["Black", "Red", "Yellow"] },
  { name: "United Kingdom", code: "gb", continent: "Europe", colors: ["Red", "White", "Blue"] },
  { name: "Australia", code: "au", continent: "Oceania", colors: ["Blue", "Red", "White"] },
  { name: "New Zealand", code: "nz", continent: "Oceania", colors: ["Blue", "Red", "White"] },
  { name: "Singapore", code: "sg", continent: "Asia", colors: ["Red", "White"] },
  { name: "Afghanistan", code: "af", continent: "Asia", colors: ["Black", "Red", "Green", "White"] },
  { name: "Cyprus", code: "cy", continent: "Europe", colors: ["White", "Orange", "Green"] },
  { name: "Georgia", code: "ge", continent: "Europe", colors: ["White", "Red"] },
  { name: "Indonesia", code: "id", continent: "Asia", colors: ["Red", "White"] },
  { name: "Kuwait", code: "kw", continent: "Asia", colors: ["Green", "White", "Red", "Black"] },
  { name: "Malaysia", code: "my", continent: "Asia", colors: ["Red", "White", "Blue", "Yellow"] },
  { name: "Maldives", code: "mv", continent: "Asia", colors: ["Red", "Green", "White"] },
  { name: "Philippines", code: "ph", continent: "Asia", colors: ["Blue", "Red", "White", "Yellow"] },
  { name: "Saudi Arabia", code: "sa", continent: "Asia", colors: ["Green", "White"] },
  { name: "Turkey", code: "tr", continent: "Europe", colors: ["Red", "White"] },
  { name: "United Arab Emirates", code: "ae", continent: "Asia", colors: ["Green", "White", "Black", "Red"] },
  { name: "Oman", code: "om", continent: "Asia", colors: ["Red", "White", "Green"] },
  { name: "France", code: "fr", continent: "Europe", colors: ["Blue", "White", "Red"] },
  { name: "Poland", code: "pl", continent: "Europe", colors: ["White", "Red"] },
  { name: "Portugal", code: "pt", continent: "Europe", colors: ["Green", "Red", "Yellow"] },
  { name: "Spain", code: "es", continent: "Europe", colors: ["Red", "Yellow"] },
  { name: "Switzerland", code: "ch", continent: "Europe", colors: ["Red", "White"] },
  { name: "Canada", code: "ca", continent: "Americas", colors: ["Red", "White"] },
  { name: "Brazil", code: "br", continent: "Americas", colors: ["Green", "Yellow", "Blue", "White"] },
  { name: "South Africa", code: "za", continent: "Africa", colors: ["Green", "Yellow", "Black", "White", "Red", "Blue"] },
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

function generateQuestion(mode) {
  const pool = QUIZ_FLAGS;
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const otherPool = pool.filter((f) => f.code !== answer.code);
  const wrongAnswers = shuffle(otherPool).slice(0, 3);
  const options = shuffle([answer, ...wrongAnswers]);
  return { answer, options, mode };
}

const QUIZ_MODES = [
  { id: 'flag-to-name', label: '🏳️ Flag → Name', desc: 'See a flag, pick the country' },
  { id: 'name-to-flag', label: '📝 Name → Flag', desc: 'See a name, pick the flag' },
];

export default function NainishhaQuiz({ setScore }) {
  const [mode, setMode] = useState(null);
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

  const speakQuestion = (q) => {
    if (q.mode === 'flag-to-name') {
      speak('Nainishha, can you say which country this flag belongs to?');
    } else {
      speak(`Nainishha, which flag belongs to ${q.answer.name}?`);
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
    const q = generateQuestion(mode);
    setQuestion(q);
    setQuestionNum((n) => n + 1);
    speakQuestion(q);
    enableHoverAfterDelay();
    setTimeout(() => setAnimation(''), 400);
  }, [mode, questionNum]);

  const startQuiz = useCallback((selectedMode) => {
    const q = generateQuestion(selectedMode);
    setQuestion(q);
    setQuestionNum(1);
    setAnimation('slide-in');
    speakQuestion(q);
    enableHoverAfterDelay();
    setTimeout(() => setAnimation(''), 400);
  }, []);

  const handleOptionHover = (opt, idx) => {
    if (showResult || !hoverEnabled) return;
    setHoveredIdx(idx);
    speakOptionOnly(opt.name);
  };

  const handleOptionTouch = (opt, idx) => {
    if (showResult) return;
    setHoveredIdx(idx);
    speakOptionOnly(opt.name);
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
        speakOptionOnly(opts[next].name);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = hoveredIdx > 0 ? hoveredIdx - 1 : opts.length - 1;
        setHoveredIdx(prev);
        speakOptionOnly(opts[prev].name);
      } else if (e.key === 'Enter' && hoveredIdx >= 0) {
        e.preventDefault();
        handleAnswer(opts[hoveredIdx]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [question, showResult, hoveredIdx]);

  const handleAnswer = (option) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
    setHoverEnabled(false);

    const isCorrect = option.code === question.answer.code;

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
      speak(`${question.answer.name}. Well done Nainishha, it is the right answer!`);
    } else {
      speak(`It was ${question.answer.name}. Well try Nainishha, try again!`);
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

  const isCorrect = (option) => option.code === question?.answer?.code;

  const getOptionClass = (option, idx) => {
    let cls = '';
    if (idx === hoveredIdx && !showResult) cls += ' hovered';
    if (!showResult) return cls;
    if (isCorrect(option)) return cls + ' correct';
    if (selected && option.code === selected.code && !isCorrect(option)) return cls + ' wrong';
    return cls + ' dimmed';
  };

  // Mode selection
  if (!mode) {
    return (
      <div className="quiz-page">
        <h2>🌟 Nainishha's Flag Quiz</h2>
        <p className="quiz-subtitle">Test your knowledge of selected world flags!</p>
        <div className="nainishha-flag-preview">
          {QUIZ_FLAGS.map((f) => (
            <img
              key={f.code}
              src={getFlagUrl(f.code, 40)}
              alt={f.name}
              title={f.name}
              className="nainishha-mini-flag"
            />
          ))}
        </div>
        <div className="mode-grid">
          {QUIZ_MODES.map((m) => (
            <button key={m.id} className="mode-card" onClick={() => {
              setMode(m.id);
              startQuiz(m.id);
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

  // Summary
  if (showSummary) {
    const pct = Math.round((sessionScore.correct / sessionScore.total) * 100);
    let medal = '🥉';
    let message = 'Keep practicing, Nainishha!';
    if (pct >= 90) { medal = '🏆'; message = 'Amazing, Nainishha! You\'re a flag master!'; }
    else if (pct >= 70) { medal = '🥇'; message = 'Great job, Nainishha! Almost perfect!'; }
    else if (pct >= 50) { medal = '🥈'; message = 'Good effort, Nainishha! Keep learning!'; }

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
                  <img src={getFlagUrl(opt.code, 160)} alt="Option" />
                  {showResult && <span className="flag-option-label">{opt.name}</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {showResult && (
          <div className={`result-banner ${isCorrect(selected) ? 'correct' : 'wrong'}`}>
            {isCorrect(selected) ? (
              <span>🎉 {question.answer.name} — Nainishha, good job! It is the right answer, well done! +1 ⭐</span>
            ) : (
              <span>
                ❌ It was <strong>{question.answer.name}</strong>. Don't worry Nainishha, keep trying!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
