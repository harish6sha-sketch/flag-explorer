// Simple atlas-style SVG world map with country highlight marker
// Uses equirectangular projection: x=(lng+180)/360*1000, y=(90-lat)/180*500

const toX = (lng) => ((lng + 180) / 360) * 1000;
const toY = (lat) => ((90 - lat) / 180) * 500;

// Simplified continent outlines (rough polygons for visual recognition)
const CONTINENTS = [
  {
    name: "North America", labelX: 180, labelY: 95,
    fill: "#b8d8ba",
    d: "M28 69 L80 56 L125 48 L200 50 L264 60 L310 72 L347 100 L310 112 L296 130 L278 172 L250 158 L230 190 L208 185 L186 160 L167 153 L153 118 L111 100 L70 92 Z"
  },
  {
    name: "South America", labelX: 320, labelY: 290,
    fill: "#a8d5a2",
    d: "M280 230 L310 220 L350 225 L390 255 L400 278 L390 305 L365 335 L340 356 L310 380 L295 370 L280 330 L272 290 L268 260 Z"
  },
  {
    name: "Europe", labelX: 510, labelY: 78,
    fill: "#c5deb5",
    d: "M470 140 L485 145 L505 128 L490 100 L480 80 L498 68 L535 52 L558 60 L578 66 L608 78 L598 95 L590 115 L565 128 L548 138 L530 142 L510 140 L490 142 Z"
  },
  {
    name: "Africa", labelX: 520, labelY: 240,
    fill: "#f0d9a0",
    d: "M482 150 L520 148 L550 152 L590 162 L608 178 L632 215 L618 248 L610 272 L598 305 L580 335 L558 345 L535 330 L520 305 L510 278 L500 252 L492 230 L480 205 L468 178 L458 160 Z"
  },
  {
    name: "Asia", labelX: 730, labelY: 110,
    fill: "#a8d4d0",
    d: "M600 80 L625 70 L670 58 L730 50 L800 48 L860 52 L920 62 L970 72 L945 92 L900 108 L865 130 L838 155 L810 170 L785 195 L768 210 L748 218 L725 225 L710 215 L688 205 L660 195 L640 192 L618 178 L600 155 L590 130 L592 105 Z"
  },
  {
    name: "Oceania", labelX: 870, labelY: 295,
    fill: "#f0c0a0",
    d: "M830 255 L860 248 L892 252 L910 265 L908 285 L895 300 L870 308 L845 305 L828 292 L822 275 Z"
  },
];

export default function WorldMap({ lat, lng, countryName, continent }) {
  const cx = toX(lng);
  const cy = toY(lat);

  // Determine which continent to highlight
  const highlightContinent = CONTINENTS.find(c =>
    c.name.toLowerCase().includes((continent || '').toLowerCase()) ||
    (continent === 'Americas' && (c.name.includes('North') || c.name.includes('South')))
  );

  return (
    <div className="atlas-map-wrapper">
      <svg viewBox="0 0 1000 500" className="atlas-map-svg">
        {/* Ocean background */}
        <rect x="0" y="0" width="1000" height="500" fill="#d4e6f1" rx="12" />

        {/* Grid lines for atlas feel */}
        {[...Array(7)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 62.5} x2="1000" y2={(i + 1) * 62.5} stroke="#bdd5ea" strokeWidth="0.5" strokeDasharray="4 4" />
        ))}
        {[...Array(9)].map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="500" stroke="#bdd5ea" strokeWidth="0.5" strokeDasharray="4 4" />
        ))}

        {/* Equator */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="#90b8d4" strokeWidth="1" strokeDasharray="8 4" opacity="0.6" />
        <text x="15" y="246" fill="#7ba3c2" fontSize="10" fontWeight="600">Equator</text>

        {/* Continent shapes */}
        {CONTINENTS.map((c) => (
          <g key={c.name}>
            <path
              d={c.d}
              fill={c.fill}
              stroke="#8ab88a"
              strokeWidth="1.5"
              opacity={highlightContinent && highlightContinent.name === c.name ? 0.9 : 0.55}
            />
            <text
              x={c.labelX}
              y={c.labelY}
              fill="#4a7a4a"
              fontSize="11"
              fontWeight="600"
              textAnchor="middle"
              opacity="0.7"
            >
              {c.name}
            </text>
          </g>
        ))}

        {/* Country marker - outer pulse ring */}
        <circle cx={cx} cy={cy} r="18" fill="none" stroke="#e74c3c" strokeWidth="2" opacity="0.3">
          <animate attributeName="r" from="10" to="25" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* Country marker - inner dot */}
        <circle cx={cx} cy={cy} r="6" fill="#e74c3c" stroke="white" strokeWidth="2.5">
          <animate attributeName="r" from="5" to="7" dur="0.8s" repeatCount="indefinite" values="5;7;5" />
        </circle>

        {/* Country label */}
        <rect
          x={cx + 12}
          y={cy - 12}
          width={countryName.length * 7.5 + 16}
          height="22"
          rx="6"
          fill="rgba(231,76,60,0.9)"
        />
        <text
          x={cx + 20}
          y={cy + 3}
          fill="white"
          fontSize="12"
          fontWeight="700"
        >
          {countryName}
        </text>
      </svg>
    </div>
  );
}
