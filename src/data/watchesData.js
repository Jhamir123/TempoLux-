export const WATCHES = [
  {
    id: 'rolex-datejust-41',
    name: 'Datejust 41',
    series: 'Oyster Perpetual',
    tagline: 'El arquetipo del reloj clásico moderno.',
    price: '$12,450',
    priceNum: 12450,
    diameter: '41 mm',
    caseMaterial: 'Oystersteel y Oro Blanco',
    bezel: 'Estriado en Oro Blanco de 18 quilates',
    movement: 'Calibre 3235 Manufactura Rolex',
    powerReserve: '70 horas aprox.',
    waterResistance: '100 metros / 330 pies',
    crystal: 'Zafiro resistente a las rayaduras con lente Cyclops',
    bracelet: 'Jubilee de cinco eslabones con cierre Oysterclasp',
    colors: [
      { id: 'emerald', name: 'Verde Esmeralda', hex: '#00c853', dialHex: '#0d5c2e', accentGlow: 'rgba(0, 200, 83, 0.4)' },
      { id: 'sapphire', name: 'Azul Zafiro', hex: '#2563eb', dialHex: '#122c54', accentGlow: 'rgba(37, 99, 235, 0.4)' },
      { id: 'black', name: 'Negro Obsidiana', hex: '#1e293b', dialHex: '#0a0d12', accentGlow: 'rgba(148, 163, 184, 0.3)' },
      { id: 'champagne', name: 'Oro Champagne', hex: '#d4af37', dialHex: '#5e4c19', accentGlow: 'rgba(212, 175, 55, 0.4)' },
      { id: 'silver', name: 'Plata Rodio', hex: '#cbd5e1', dialHex: '#334155', accentGlow: 'rgba(203, 213, 225, 0.4)' }
    ],
    features: [
      'Espiral Parachrom azul paramagnética',
      'Amortiguadores de golpes Paraflex de alto rendimiento',
      'Precisión cronométrica certificada (-2/+2 seg/día)'
    ]
  },
  {
    id: 'rolex-submariner',
    name: 'Submariner Date',
    series: 'Oyster Professional',
    tagline: 'El referente supremo de los relojes de submarinismo.',
    price: '$14,800',
    priceNum: 14800,
    diameter: '41 mm',
    caseMaterial: 'Oystersteel 904L de alta resistencia',
    bezel: 'Cerachrom giratorio unidireccional negro con números en platino',
    movement: 'Calibre 3235 Automático',
    powerReserve: '70 horas',
    waterResistance: '300 metros / 1,000 pies',
    crystal: 'Zafiro con lente Cyclops sobre la fecha',
    bracelet: 'Oyster con sistema de extensión Rolex Glidelock',
    colors: [
      { id: 'black', name: 'Negro Cerachrom', hex: '#1e293b', dialHex: '#080a0f', accentGlow: 'rgba(59, 130, 246, 0.3)' },
      { id: 'emerald', name: 'Verde Kermit', hex: '#00c853', dialHex: '#0a3d1c', accentGlow: 'rgba(0, 200, 83, 0.4)' },
      { id: 'sapphire', name: 'Azul Real', hex: '#1d4ed8', dialHex: '#0f274a', accentGlow: 'rgba(37, 99, 235, 0.4)' }
    ],
    features: [
      'Visualización Chromalight de alta legibilidad con luminiscencia azul',
      'Válvula de helio integrada para inmersiones profundas',
      'Hermeticidad sellada mediante corona Triplock'
    ]
  },
  {
    id: 'rolex-daytona',
    name: 'Cosmograph Daytona',
    series: 'Oyster Chronograph',
    tagline: 'Nacido para la velocidad y la alta competición automovilística.',
    price: '$18,900',
    priceNum: 18900,
    diameter: '40 mm',
    caseMaterial: 'Oystersteel y Oro Everose de 18k',
    bezel: 'Escala taquimétrica grabada en Cerachrom monobloque',
    movement: 'Calibre 4131 Cronógrafo Mecánico',
    powerReserve: '72 horas',
    waterResistance: '100 metros / 330 pies',
    crystal: 'Zafiro antirreflejos de pureza absoluta',
    bracelet: 'Oysterflex con láminas metálicas flexibles sobremoldeadas',
    colors: [
      { id: 'black', name: 'Panda Negro', hex: '#0f172a', dialHex: '#0f172a', accentGlow: 'rgba(255, 255, 255, 0.3)' },
      { id: 'champagne', name: 'Oro Everose', hex: '#d4af37', dialHex: '#4a3712', accentGlow: 'rgba(212, 175, 55, 0.4)' },
      { id: 'silver', name: 'Platino Helado', hex: '#38bdf8', dialHex: '#1e3a5f', accentGlow: 'rgba(56, 189, 248, 0.4)' }
    ],
    features: [
      'Embrague vertical para una activación de cronógrafo sin salto',
      'Rueda de pilares de ultra precisión',
      'Escala taquimétrica para medir velocidades de hasta 400 km/h'
    ]
  }
];

export const BRAND_PARTNERS = [
  { name: 'logicor', icon: 'fa-cubes', label: 'LOGICOR' },
  { name: 'Vertex', icon: 'fa-shapes', label: 'VERTEX' },
  { name: 'cloudix', icon: 'fa-globe', label: 'CLOUDIX' },
  { name: 'prism', icon: 'fa-gem', label: 'PRISM' },
  { name: 'north', icon: 'fa-compass', label: 'NORTH' },
  { name: 'volta', icon: 'fa-circle-notch', label: 'VOLTA' }
];

export const LUXURY_SPECS = [
  { icon: 'fa-shield-halved', title: 'Oystersteel 904L', desc: 'Aleación aeroespacial de máxima resistencia' },
  { icon: 'fa-microchip', title: 'Calibre 3235', desc: 'Movimiento automático suizo de última generación' },
  { icon: 'fa-gem', title: 'Cristal Zafiro', desc: 'Dureza 9 Mohs con tratamiento antirreflejos' },
  { icon: 'fa-water', title: 'Hermético 100M', desc: 'Sellado hermético con corona Twinlock' },
  { icon: 'fa-certificate', title: 'Superlative Chronometer', desc: 'Certificado de precisión de -2/+2 seg/día' },
  { icon: 'fa-award', title: 'Garantía 5 Años', desc: 'Cobertura internacional oficial' }
];

