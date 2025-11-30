module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blueDarken: '#233c4b',
          chesta: '#ff7d2d',
          brightSun: '#fac846',
          olivia: '#a0c382',
          palma: '#5f9b8c',
          darkBg: '#0f1b23'
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0f1b23 0%, #1a3a4a 50%, #0f1b23 100%)'
      }
    },
  },
  plugins: [],
};
