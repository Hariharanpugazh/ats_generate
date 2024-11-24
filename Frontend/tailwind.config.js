// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/pages/login.js",
//     "./src/pages/register.js",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, './*.js'), // Include all JS files in the pages folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
