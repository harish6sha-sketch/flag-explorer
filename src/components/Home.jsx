import { useState, useEffect } from 'react';
import { getFlagUrl } from '../data/flags';

const floatingFlags = [
  { code: 'us', x: 10, y: 15, delay: 0 },
  { code: 'gb', x: 80, y: 10, delay: 1 },
  { code: 'jp', x: 20, y: 70, delay: 2 },
  { code: 'br', x: 75, y: 65, delay: 0.5 },
  { code: 'fr', x: 50, y: 20, delay: 1.5 },
  { code: 'in', x: 85, y: 40, delay: 2.5 },
  { code: 'ca', x: 5, y: 45, delay: 3 },
  { code: 'de', x: 60, y: 80, delay: 1.2 },
  { code: 'qa', x: 40, y: 50, delay: 0.8 },
  { code: 'au', x: 90, y: 75, delay: 2.2 },
];

export default function Home({ onNavigate, score }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div className={`home ${loaded ? 'loaded' : ''}`}>
      <div className="floating-flags">
        {floatingFlags.map((f) => (
          <img
            key={f.code}
            src={getFlagUrl(f.code, 80)}
            alt=""
            className="floating-flag"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              animationDelay: `${f.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="home-content">
        <h1 className="home-title">
          <span className="title-emoji">🌍</span>
          <span className="title-text">Flag Explorer</span>
          <span className="title-emoji">🏳️</span>
        </h1>
        <p className="home-subtitle">Learn the flags of the world!</p>

        {score.total > 0 && (
          <div className="home-stats">
            <div className="stat">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{score.stars}</span>
              <span className="stat-label">Stars</span>
            </div>
            <div className="stat">
              <span className="stat-icon">🎯</span>
              <span className="stat-value">{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{score.bestStreak}</span>
              <span className="stat-label">Best Streak</span>
            </div>
          </div>
        )}

        <div className="home-buttons">
          <button className="home-btn learn-btn" onClick={() => onNavigate('learn')}>
            <span className="btn-icon">📚</span>
            <span className="btn-text">
              <strong>Learn Flags</strong>
              <small>Explore & discover</small>
            </span>
          </button>
          <button className="home-btn quiz-btn" onClick={() => onNavigate('quiz')}>
            <span className="btn-icon">🎯</span>
            <span className="btn-text">
              <strong>Take a Quiz</strong>
              <small>Test your knowledge</small>
            </span>
          </button>
          <button className="home-btn similar-btn" onClick={() => onNavigate('similar')}>
            <span className="btn-icon">🔀</span>
            <span className="btn-text">
              <strong>Similar Flags</strong>
              <small>Spot the difference</small>
            </span>
          </button>
          <button className="home-btn nainishha-btn" onClick={() => onNavigate('nainishha-quiz')}>
            <span className="btn-icon">🌟</span>
            <span className="btn-text">
              <strong>Nainishha's Quiz</strong>
              <small>Special flag challenge</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
