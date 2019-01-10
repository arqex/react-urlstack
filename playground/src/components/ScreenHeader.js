import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {SharedElement} from 'react-urlstack';


export default class ScreenHeader extends Component {
	render(){
		return (
			<SharedElement style={ styles.bar }>
				<SharedElement style={ styles.content }>
					<Text style={ styles.text }>{ this.props.title }</Text>
				</SharedElement>
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