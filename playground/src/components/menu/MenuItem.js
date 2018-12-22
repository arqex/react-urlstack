import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Hoverable from '../hover/Hoverable';

const MenuItem = ({
	children, router, route
}) => (
	<Hoverable style={ styles.container } hoverStyle={ styles.hover } onPress={ () => router.navigate( route ) }>
		<Text style={ styles.text }>{ children }</Text>
	</Hoverable>
);

let styles = StyleSheet.create({
	container: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 30,
		paddingRight: 20
	},
	text: {
		fontSize: 16
	},
	hover: {
		backgroundColor: '#fff'
	}
})

export default MenuItem;
