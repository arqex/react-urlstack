const Path = require('path')
const cPath = Path.join(__dirname, '../src/components/gallery')
const fs = require('fs')

const uiPath = function( name ){
	return Path.join( cPath, 'ui', name )
}

module.exports = {
	components: '../src/components/gallery/**/[A-Z]*.js',
	webpackConfig: require('./webpack.config.dev.js'),
	context: {
		polyfill: '@babel/polyfill',
		RN: 'react-native'
	},

	sections: [
		{name: 'Component gallery', content: Path.join(cPath, 'introduction.md') },
		{name: 'UI', components: [
			uiPath('Button.js'),
			uiPath('DynamicHeaderList.js'),
			uiPath('ListItem.js'),
			uiPath('TabSelector.js'),
		]},
		{
			name: 'Icons',
			components: Path.join(cPath, 'icons/**/[A-Z]*.web.js'),
			description: fs.readFileSync( Path.join(cPath, 'icons/icons.md'), 'utf-8' )
		},
		{name: 'Interactions', components: Path.join(cPath, 'interactions/**/[A-Z]*.js') },
	],
}