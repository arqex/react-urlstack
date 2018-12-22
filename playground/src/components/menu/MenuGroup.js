import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';

const MenuGroup = ({
	children, title
}) => (
	<View style={styles.container}>
		<View style={styles.titleContainer}>
			<Text style={styles.titleText}>{ title }</Text>
		</View>
		<View style={ styles.itemContainer }>{ children }</View>
	</View>
);

let styles = StyleSheet.create({
	container: {
		marginTop: 20
	},
	titleContainer: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20
	},
	titleText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#464a48'
	},
	itemContainer: {

	}
})

export default MenuGroup;
