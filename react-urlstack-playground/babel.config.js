let Path = require('path');

module.exports = function(api) {
  api.cache(false);

  return {
    presets: ['babel-preset-expo'],
    /*
    plugins: [[
      'module-resolver', {
        root: [ Path.join( __dirname, '..') ],
        alias: {
          // 'react-urlstack': './react-urlstack.js'
        }
      }
    ]]
    */
  };
};
