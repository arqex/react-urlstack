module.exports = {
	input: ['react-urlstack.js'],
	moduleName: 'UrlStack',
	formats: ['umd'],
	global: {
		react: 'React',
		'prop-types': 'PropTypes',
		'react-native': 'ReactNative'
	},
	external: ['react-native'],
	banner: { name: '*//* eslint-disable */\n/*!\n * react-urlstack' },
	filename: '[name][suffix].js'
}