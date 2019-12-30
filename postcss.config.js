module.exports = {
  plugins: {
    'autoprefixer': {
      'overrideBrowserslist': [
        '> 1%',
        'last 3 versions',
        'ios >= 8',
        'android >= 4',
        'chrome >= 40',
        'ie >= 9'
      ]
    }
  }
}