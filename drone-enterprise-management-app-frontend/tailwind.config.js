const plugin = require('tailwindcss/plugin')

const radialGradientPlugin = plugin(
  function ({ matchUtilities, theme }) {
    matchUtilities(
      {
        'bg-radient': value => ({
          'background-image': `radial-gradient(${value},var(--tw-gradient-stops))`,
        }),
      },
      { values: theme('radialGradients') }
    )
  },
  {
    theme: {
      radialGradients: _presets(),
    },
  }
)

function _presets() {
  const shapes = ['circle', 'ellipse'];
  const pos = {
    c: 'center',
    t: 'top',
    b: 'bottom',
    l: 'left',
    r: 'right',
    tl: 'top left',
    tr: 'top right',
    bl: 'bottom left',
    br: 'bottom right',
  };
  let result = {};
  for (const shape of shapes)
    for (const [posName, posValue] of Object.entries(pos))
      result[`${shape}-${posName}`] = `${shape} at ${posValue}`;

  return result;
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html, js, ts, vue}",
    "./src/**/*"
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '19.5px'],
      lg: ['18px', '21.94px'],
      xl: ['20px', '24.38px'],
      '2xl': ['24px', '29.26px'],
      '3xl': ['28px', '35px'],
      '4xl': ['48px', '58px'],
      '6xl': ['72px', '81px'],
      '8xl': ['96px', '106px'],
      '10xl': ['125px', '135px'],
      '12xl': ['150px', '165px'],
      '16xl': ['200px', '215px']
    },
    extend: {
      fontFamily: {
        palanquin: ['Palanquin', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ["Poppins", "sans-serif"],
        oxygen: ["Oxygen", "sans-serif"]
      },
      colors: {
        'primary': "#ECEEFF",
        "coral-red": "#FF6452",
        "slate-gray": "#6D6D6D",
        "pale-blue": "#F5F6FF",
        "white-400": "rgba(255, 255, 255, 0.80)"
      },
      boxShadow: {
        '3xl': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      // backgroundImage: {
      //   'hero': "url('assets/images/collection-background.svg')",
      //   'card': "url('assets/images/thumbnail-background.svg')",
      // },
      screens: {
        "wide": "1440px"
      },
      backgroundImage: {
        'dotted-pattern': 'radial-gradient(circle, black 1px, transparent 1px)',
      },
      backgroundSize: {
        'dotted-size': '20px 20px',
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    radialGradientPlugin,
    function ({ addUtilities }) {
      addUtilities({
        '.hyphens-auto': {
          hyphens: 'auto',
        },
        '.hyphens-manual': {
          hyphens: 'manual',
        },
        '.hyphens-none': {
          hyphens: 'none',
        },
      })
    },
    require('@tailwindcss/aspect-ratio'),
  ],
}



