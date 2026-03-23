import { useState, useMemo } from 'react';
import flags, { continents, getFlagUrl, getByContinent } from '../data/flags';
import countryInfo, { getCodesByTag } from '../data/countryInfo';

const SPECIAL_FILTERS = [
  { key: 'animals', label: '🐾 Animals on Flag', filter: (f) => f.animal },
  { key: 'similar', label: '🔀 Look-alikes', filter: (f) => f.similarTo && f.similarTo.length > 0 },
  { key: 'unique-shape', label: '🔶 Unique Shapes', tagKey: 'unique-shape' },
  { key: 'stars', label: '⭐ Has Stars', tagKey: 'stars' },
  { key: 'crescent', label: '🌙 Crescent Moon', tagKey: 'crescent' },
  { key: 'cross', label: '✝️ Cross Design', tagKey: 'cross' },
  { key: 'nordic-cross', label: '➕ Nordic Cross', tagKey: 'nordic-cross' },
  { key: 'animal-on-flag', label: '🦅 Animal Depicted', tagKey: 'animal-on-flag' },
  { key: 'sun', label: '☀️ Sun Symbol', tagKey: 'sun' },
  { key: 'text', label: '📝 Has Text', tagKey: 'text' },
  { key: 'weapon', label: '⚔️ Has Weapon', tagKey: 'weapon' },
  { key: 'coat-of-arms', label: '🛡️ Coat of Arms', tagKey: 'coat-of-arms' },
  { key: 'union-jack', label: '🇬🇧 Union Jack', tagKey: 'union-jack' },
  { key: 'tricolor-v', label: '🏳️ Vertical Tricolor', tagKey: 'tricolor-v' },
  { key: 'tricolor-h', label: '🏳️ Horizontal Tricolor', tagKey: 'tricolor-h' },
  { key: 'map-on-flag', label: '🗺️ Map on Flag', tagKey: 'map-on-flag' },
  { key: 'unique-double-sided', label: '🔄 Different Each Side', tagKey: 'unique-double-sided' },
];

export default function Learn({ onSelectFlag }) {
  const [continent, setContinent] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [activeFilter, setActiveFilter] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Build a set of codes that match a tag filter
  const tagFilterCodes = useMemo(() => {
    if (!activeFilter) return null;
    const sf = SPECIAL_FILTERS.find(f => f.key === activeFilter);
    if (!sf || !sf.tagKey) return null;
    return new Set(getCodesByTag(sf.tagKey));
  }, [activeFilter]);

  const filteredFlags = useMemo(() => {
    let result = getByContinent(continent);

    // Apply special filter
    if (activeFilter) {
      const sf = SPECIAL_FILTERS.find(f => f.key === activeFilter);
      if (sf) {
        if (sf.filter) {
          result = result.filter(sf.filter);
        } else if (tagFilterCodes) {
          result = result.filter(f => tagFilterCodes.has(f.code));
        }
      }
    }

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.colors.some((c) => c.toLowerCase().includes(q)) ||
          f.continent.toLowerCase().includes(q) ||
          (f.animal && f.animal.toLowerCase().includes(q)) ||
          (countryInfo[f.code]?.capital?.toLowerCase().includes(q)) ||
          (countryInfo[f.code]?.nationalAnimal?.toLowerCase().includes(q)) ||
          (countryInfo[f.code]?.languages?.some(l => l.toLowerCase().includes(q)))
      );
    }

    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'difficulty') result.sort((a, b) => a.difficulty - b.difficulty);
    if (sortBy === 'continent') result.sort((a, b) => a.continent.localeCompare(b.continent));
    return result;
  }, [continent, search, sortBy, activeFilter, tagFilterCodes]);

  const difficultyLabel = (d) => {
    if (d === 1) return { text: 'Easy', class: 'easy' };
    if (d === 2) return { text: 'Medium', class: 'medium' };
    return { text: 'Hard', class: 'hard' };
  };

  const toggleFilter = (key) => {
    setActiveFilter(prev => prev === key ? null : key);
  };

  const primaryFilters = SPECIAL_FILTERS.slice(0, 6);
  const moreFilters = SPECIAL_FILTERS.slice(6);

  return (
    <div className="learn-page">
      <div className="learn-header">
        <h2>📚 Explore World Flags</h2>
        <p>Click on any flag to learn more about it! <strong>{flags.length}</strong> countries total.</p>
      </div>

      <div className="learn-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search country, color, animal, language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="filter-row">
          <div className="continent-tabs">
            {continents.map((c) => (
              <button
                key={c}
                className={`tab ${continent === c ? 'active' : ''}`}
                onClick={() => setContinent(c)}
              >
                {c === 'All' && '🌍 '}
                {c === 'Asia' && '🌏 '}
                {c === 'Europe' && '🌍 '}
                {c === 'Americas' && '🌎 '}
                {c === 'Africa' && '🌍 '}
                {c === 'Oceania' && '🌊 '}
                {c}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort: A-Z</option>
            <option value="difficulty">Sort: Difficulty</option>
            <option value="continent">Sort: Continent</option>
          </select>
        </div>

        <div className="special-filters">
          {primaryFilters.map((sf) => (
            <button
              key={sf.key}
              className={`filter-chip ${activeFilter === sf.key ? 'active' : ''}`}
              onClick={() => toggleFilter(sf.key)}
            >
              {sf.label}
            </button>
          ))}
          <button
            className={`filter-chip more-btn ${showMoreFilters ? 'active' : ''}`}
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            {showMoreFilters ? '▲ Less' : '▼ More Filters'}
          </button>
        </div>

        {showMoreFilters && (
          <div className="special-filters extra-filters">
            {moreFilters.map((sf) => (
              <button
                key={sf.key}
                className={`filter-chip ${activeFilter === sf.key ? 'active' : ''}`}
                onClick={() => toggleFilter(sf.key)}
              >
                {sf.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flag-count">
        {activeFilter && <button className="clear-filter-btn" onClick={() => setActiveFilter(null)}>✕ Clear filter</button>}
        <strong>{filteredFlags.length}</strong> flags found
      </div>

      <div className="flags-grid">
        {filteredFlags.map((flag, index) => {
          const diff = difficultyLabel(flag.difficulty);
          const ci = countryInfo[flag.code];
          return (
            <div
              key={flag.code}
              className="flag-card"
              onClick={() => onSelectFlag(flag)}
            >
              <div className="flag-number">#{index + 1}</div>
              <div className="flag-image-wrap">
                <img
                  src={getFlagUrl(flag.code)}
                  alt={`Flag of ${flag.name}`}
                  loading="lazy"
                />
                <span className={`difficulty-badge ${diff.class}`}>{diff.text}</span>
              </div>
              <div className="flag-card-info">
                <h3>{flag.name}</h3>
                <p className="flag-continent">
                  {flag.continent}
                  {flag.animal && <span className="animal-indicator"> 🐾</span>}
                  {flag.similarTo && flag.similarTo.length > 0 && <span className="similar-indicator"> 🔀</span>}
                </p>
                {ci && <p className="flag-capital">🏛️ {ci.capital}</p>}
                <div className="flag-colors">
                  {flag.colors.slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="color-dot"
                      style={{ backgroundColor: c.toLowerCase() === 'gold' ? '#FFD700' : c.toLowerCase() === 'light blue' ? '#87CEEB' : c.toLowerCase() === 'maroon' ? '#800000' : c.toLowerCase() }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFlags.length === 0 && (
        <div className="no-results">
          <span className="no-results-icon">🤔</span>
          <p>No flags found. Try a different search!</p>
        </div>
      )}
    </div>
  );
}
