// const { plugin } = require('twrnc'); 

// module.exports = {
//   plugins: [
//     plugin(({ addUtilities }) => {
//       addUtilities({
//         test: {
//           backgroundColor:  "red",
//         },
//       });
//     }),
//   ],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}