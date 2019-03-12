let Path = require('path');	

console.log( 'IS WEB', global.isWeb )

let presets = []
if( !global.isWeb ){
  presets.push('babel-preset-expo')
}

module.exports = function(api) {	
  api.cache(false);	

   return {	
    presets: presets,	
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