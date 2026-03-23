import { useEffect, useMemo } from 'react';
import { getFlagUrl, getSimilarFlags } from '../data/flags';
import { getCountryInfo } from '../data/countryInfo';
import { getSimilarPairsByFlag } from '../data/similarPairs';
import WorldMap from './WorldMap';

export default function FlagDetail({ flag, onClose, onSelectFlag }) {
  const info = useMemo(() => getCountryInfo(flag.code), [flag.code]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const diffLabel = flag.difficulty === 1 ? 'Easy' : flag.difficulty === 2 ? 'Medium' : 'Hard';
  const diffClass = flag.difficulty === 1 ? 'easy' : flag.difficulty === 2 ? 'medium' : 'hard';
  const similarFlags = getSimilarFlags(flag.code);
  const similarPairInfo = useMemo(() => getSimilarPairsByFlag(flag.code), [flag.code]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-flag">
          <img src={getFlagUrl(flag.code, 640)} alt={`Flag of ${flag.name}`} />
        </div>

        <div className="modal-info">
          <h2>{flag.name}</h2>
          <div className="modal-meta">
            <span className="meta-tag continent-tag">{flag.continent}</span>
            <span className={`meta-tag difficulty-tag ${diffClass}`}>{diffLabel}</span>
            {flag.animal && <span className="meta-tag animal-tag">🐾 {flag.animal}</span>}
          </div>

          {/* Quick Country Facts */}
          {info && (
            <div className="country-quick-facts">
              <div className="quick-fact">
                <span className="qf-icon">🏛️</span>
                <div><strong>Capital</strong><span>{info.capital}</span></div>
              </div>
              <div className="quick-fact">
                <span className="qf-icon">🗣️</span>
                <div><strong>Language{info.languages.length > 1 ? 's' : ''}</strong><span>{info.languages.join(', ')}</span></div>
              </div>
              {info.nationalAnimal && info.nationalAnimal !== "None" && (
                <div className="quick-fact">
                  <span className="qf-icon">🦁</span>
                  <div><strong>National Animal</strong><span>{info.nationalAnimal}</span></div>
                </div>
              )}
            </div>
          )}

          {/* Colors */}
          <div className="modal-section">
            <h3>🎨 Colors</h3>
            <div className="modal-colors">
              {flag.colors.map((c) => (
                <div key={c} className="modal-color">
                  <span
                    className="modal-color-dot"
                    style={{ backgroundColor: c.toLowerCase() === 'gold' ? '#FFD700' : c.toLowerCase() === 'light blue' ? '#87CEEB' : c.toLowerCase() === 'maroon' ? '#800000' : c.toLowerCase() }}
                  />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flag Details & Meaning */}
          {flag.details && (
            <div className="modal-section details-section">
              <h3>📖 Flag Details & Meaning</h3>
              <p className="details-text">{flag.details}</p>
            </div>
          )}

          {/* Memory Trick */}
          <div className="modal-section tip-section">
            <h3>💡 How to Remember</h3>
            <p className="tip-text">{flag.tip}</p>
          </div>

          {/* Fun Fact */}
          <div className="modal-section">
            <h3>🧠 Fun Fact</h3>
            <p className="fact-text">{flag.funFact}</p>
          </div>

          {/* Animal on Flag */}
          {flag.animal && (
            <div className="modal-section animal-section">
              <h3>🐾 Animal on Flag</h3>
              <p className="animal-text">This flag features a <strong>{flag.animal}</strong>!</p>
            </div>
          )}

          {/* National Animal (country's symbolic animal) */}
          {info && info.nationalAnimal && info.nationalAnimal !== "None" && !flag.animal && (
            <div className="modal-section animal-section">
              <h3>🦁 National Animal</h3>
              <p className="animal-text">The national animal of {flag.name} is the <strong>{info.nationalAnimal}</strong>.</p>
            </div>
          )}

          {/* Famous Landmarks */}
          {info && info.landmarks && (
            <div className="modal-section landmarks-section">
              <h3>🏛️ Famous Landmarks</h3>
              <div className="landmarks-list">
                {info.landmarks.map((lm) => (
                  <div key={lm} className="landmark-item">
                    <span className="landmark-dot">📍</span>
                    <span>{lm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Country Map */}
          {info && (
            <div className="modal-section map-section">
              <h3>🗺️ Where is {flag.name}?</h3>
              <WorldMap lat={info.lat} lng={info.lng} countryName={flag.name} continent={flag.continent} />
            </div>
          )}

          {/* Flag Categories / Tags */}
          {info && info.tags && info.tags.length > 0 && (
            <div className="modal-section">
              <h3>🏷️ Flag Categories</h3>
              <div className="tag-chips">
                {info.tags.map((tag) => (
                  <span key={tag} className="tag-chip">{tag.replace(/-/g, ' ')}</span>
                ))}
              </div>
            </div>
          )}

          {/* Similar Flags */}
          {similarFlags.length > 0 && (
            <div className="modal-section">
              <h3>🔀 Similar Flags — Don't Confuse!</h3>
              <div className="similar-flags">
                {similarFlags.map((sf) => (
                  <button
                    key={sf.code}
                    className="similar-flag-card"
                    onClick={() => onSelectFlag && onSelectFlag(sf)}
                  >
                    <img src={getFlagUrl(sf.code, 160)} alt={sf.name} />
                    <span>{sf.name}</span>
                  </button>
                ))}
              </div>
              {similarPairInfo.length > 0 && (
                <div className="similar-pair-tips">
                  {similarPairInfo.map((pair) => (
                    <div key={pair.id} className="pair-tip-card">
                      <strong>{pair.title}</strong>
                      <p className="pair-tip-quick">💡 {pair.quickTip}</p>
                      <p className="pair-tip-how">{pair.howToDistinguish}</p>
                      <p className="pair-tip-memory">🧠 {pair.memoryTrick}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
