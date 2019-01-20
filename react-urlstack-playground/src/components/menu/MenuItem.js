import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Hoverable from '../hover/Hoverable';

const MenuItem = ({
	children, router, route, active
}) => (
	<Hoverable style={ [styles.container, active && styles.activeContainer] }
		hoverStyle={ [styles.hover] }
		onPress={ () => console.log( "pressed" ) || router.navigate( route ) }>
			<Text style={ [styles.text, active && styles.active] }>{ children }</Text>
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
	},
	activeContainer: {
		backgroundColor: '#ddd'
	},
	active: {
		fontWeight: 'bold'
	}
})

export default MenuItem;
