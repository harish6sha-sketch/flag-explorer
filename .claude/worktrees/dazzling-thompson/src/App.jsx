import { useState, useEffect } from 'react';
import Home from './components/Home';
import Learn from './components/Learn';
import Quiz from './components/Quiz';
import SimilarFlags from './components/SimilarFlags';
import FlagDetail from './components/FlagDetail';

function App() {
  const [page, setPage] = useState('home');
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('flagExplorerScore');
    return saved ? JSON.parse(saved) : { total: 0, correct: 0, streak: 0, bestStreak: 0, stars: 0 };
  });

  useEffect(() => {
    localStorage.setItem('flagExplorerScore', JSON.stringify(score));
  }, [score]);

  const navigate = (p) => {
    setSelectedFlag(null);
    setPage(p);
  };

  return (
    <div className="app">
      {page !== 'home' && (
        <nav className="navbar">
          <button className="nav-brand" onClick={() => navigate('home')}>
            <span className="nav-globe">🌍</span> Flag Explorer
          </button>
          <div className="nav-links">
            <button className={page === 'learn' ? 'active' : ''} onClick={() => navigate('learn')}>
              📚 Learn
            </button>
            <button className={page === 'quiz' ? 'active' : ''} onClick={() => navigate('quiz')}>
              🎯 Quiz
            </button>
            <button className={page === 'similar' ? 'active' : ''} onClick={() => navigate('similar')}>
              🔀 Similar
            </button>
          </div>
          <div className="nav-score">
            ⭐ {score.stars} | 🔥 {score.streak}
          </div>
        </nav>
      )}

      <main className="main-content">
        {page === 'home' && <Home onNavigate={navigate} score={score} />}
        {page === 'learn' && (
          <Learn onSelectFlag={setSelectedFlag} />
        )}
        {page === 'quiz' && (
          <Quiz setScore={setScore} onSelectFlag={setSelectedFlag} />
        )}
        {page === 'similar' && (
          <SimilarFlags onSelectFlag={setSelectedFlag} />
        )}
      </main>

      {selectedFlag && (
        <FlagDetail flag={selectedFlag} onClose={() => setSelectedFlag(null)} onSelectFlag={setSelectedFlag} />
      )}
    </div>
  );
}

export default App;
