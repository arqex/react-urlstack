const Path = require('path')
const cPath = Path.join(__dirname, '../src/components/gallery')
const fs = require('fs')

module.exports = {
	components: '../src/components/gallery/**/[A-Z]*.js',
	webpackConfig: require('./webpack.config.dev.js'),
	context: {
		polyfill: '@babel/polyfill',
		RN: 'react-native'
	},

	sections: [
		{name: 'Component gallery', content: Path.join(cPath, 'introduction.md') },
		{name: 'UI', components: Path.join(cPath, 'ui/**/[A-Z]*.js') },
		{
			name: 'Icons',
			components: Path.join(cPath, 'icons/**/[A-Z]*.js'),
			description: fs.readFileSync( Path.join(cPath, 'icons/icons.md'), 'utf-8' )
		},
		{name: 'Interactions', components: Path.join(cPath, 'interactions/**/[A-Z]*.js') },
	],
}