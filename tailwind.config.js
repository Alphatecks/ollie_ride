const plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    extend: {
      colors: {
        ollie: {
          100: '#ffe8cc',
          150: '#ffddb3',
          200: '#ffd199',
          250: '#ffc680',
          300: '#ffba66',
          350: '#ffaf4d',
          400: '#ffa333',
          450: '#ff981a',
          500: '#ff8c00',
          base: '#0C3569',
          600: '#e67e00',
          650: '#cc7000',
          700: '#b36200',
          750: '#995400',
          800: '#804600',
          850: '#663800',
          900: '#4d2a00',
          950: '#331c00', 
        }
      }
    }
  },

 plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        // 😎 similar to `@apply`
        '.btn': `p-4 text-white rounded-md`,
        '.btn-secondary': `p-4 rounded-md my-3 text-white`,
        '.outline': `border-[#008955] p-4 w-full border-blue-800`,
        '.input': `border rounded-md border-gray-300 p-3 mb-3`,
        'poppins': { fontFamily: "Poppins_400Regular" },
        'poppinsMedium': { fontFamily: "Poppins_500Medium" },
      });
    }),
  ],

}
