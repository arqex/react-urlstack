import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SharedComponent} from 'react-urlstack';


export default class ScreenHeader extends Component {
	render(){
		return (
			<SharedComponent style={ styles.bar }>
				<SharedComponent style={ styles.content }>
					<View></View>
					<Text>{ this.props.title }</Text>
				</SharedComponent>
			</SharedComponent>
		);
	}
}

let styles = StyleSheet.create({
	bar: {},
	content: {}
})