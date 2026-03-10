import { useState, useMemo } from 'react';
import { getFlagUrl } from '../data/flags';
import flags from '../data/flags';
import { getCategories, getAllPairs } from '../data/similarPairs';

export default function SimilarFlags({ onSelectFlag }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedPair, setExpandedPair] = useState(null);

  const categories = useMemo(() => getCategories(), []);
  const allPairs = useMemo(() => getAllPairs(), []);
  const categoryNames = useMemo(() => ['All', ...Object.keys(categories)], [categories]);

  const filteredPairs = activeCategory === 'All'
    ? allPairs
    : categories[activeCategory] || [];

  const getFlagByCode = (code) => flags.find(f => f.code === code);

  return (
    <div className="similar-page">
      <div className="similar-header">
        <h2>🔀 Similar Flags — Spot the Difference!</h2>
        <p>These flags look alike but have key differences. Learn how to tell them apart!</p>
      </div>

      <div className="similar-categories">
        {categoryNames.map(cat => (
          <button
            key={cat}
            className={`sim-cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="similar-count">{filteredPairs.length} comparisons</div>

      <div className="similar-pairs-list">
        {filteredPairs.map(pair => {
          const flag1 = getFlagByCode(pair.flags[0]);
          const flag2 = getFlagByCode(pair.flags[1]);
          if (!flag1 || !flag2) return null;
          const isExpanded = expandedPair === pair.id;

          return (
            <div key={pair.id} className={`similar-pair-card ${isExpanded ? 'expanded' : ''}`}>
              <div className="pair-header" onClick={() => setExpandedPair(isExpanded ? null : pair.id)}>
                <div className="pair-flags-preview">
                  <div className="pair-flag-thumb" onClick={(e) => { e.stopPropagation(); onSelectFlag(flag1); }}>
                    <img src={getFlagUrl(flag1.code, 160)} alt={flag1.name} />
                    <span>{flag1.name}</span>
                  </div>
                  <span className="vs-badge">VS</span>
                  <div className="pair-flag-thumb" onClick={(e) => { e.stopPropagation(); onSelectFlag(flag2); }}>
                    <img src={getFlagUrl(flag2.code, 160)} alt={flag2.name} />
                    <span>{flag2.name}</span>
                  </div>
                </div>
                <div className="pair-quick-info">
                  <h3>{pair.title}</h3>
                  <span className="pair-category-tag">{pair.category}</span>
                  <p className="pair-quick-tip">💡 {pair.quickTip}</p>
                </div>
                <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
              </div>

              {isExpanded && (
                <div className="pair-details">
                  <div className="pair-flags-large">
                    <div className="pair-flag-large" onClick={() => onSelectFlag(flag1)}>
                      <img src={getFlagUrl(flag1.code, 320)} alt={flag1.name} />
                      <strong>{flag1.name}</strong>
                    </div>
                    <div className="pair-flag-large" onClick={() => onSelectFlag(flag2)}>
                      <img src={getFlagUrl(flag2.code, 320)} alt={flag2.name} />
                      <strong>{flag2.name}</strong>
                    </div>
                  </div>

                  <div className="pair-distinguish">
                    <h4>🔍 How to Tell Them Apart</h4>
                    <p>{pair.howToDistinguish}</p>
                  </div>

                  <div className="pair-memory">
                    <h4>🧠 Memory Trick</h4>
                    <p>{pair.memoryTrick}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
