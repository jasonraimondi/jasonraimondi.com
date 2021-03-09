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
        md: "100%",
        lg: "1000px",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
