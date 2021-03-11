module.exports = {
  purge: [
    './content/**/*.html',
    './layouts/**/*.html',
    './taxonomy/**/*.html',
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      screens: {
        sm: "100%",
        md: "800px",
        lg: "1000px",
        xlg: "1000px",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
