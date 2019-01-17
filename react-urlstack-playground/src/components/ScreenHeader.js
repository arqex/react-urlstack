import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {SharedElement} from 'react-urlstack';

function contentTransition( animatedValue, fromIndex, toIndex, box ){
	let translation = animatedValue.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: ['-100%', '0%', '100%']
	});

	return {
		transform: [{translateX: translation}]
	}
}

export default class ScreenHeader extends Component {
	render(){
		return (
			<SharedElement style={ styles.bar } contentTransition={ contentTransition }>
				<Text style={ styles.text }>{ this.props.title }</Text>
			</SharedElement>
		);
	}
}

let styles = StyleSheet.create({
	bar: {
		backgroundColor: 'red',
	},
	content: {},
	test: {
		color: 'white',
	}
})