import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const MenuItem = ({
	children
}) => (
	<View style={styles.container}>
		<Text style={styles.title}>react-urlstack</Text>
		<Text style={styles.subtitle}>playground</Text>
	</View>
);

let styles = StyleSheet.create({
	container: {
		height: 100,
		backgroundColor: '#c2cbce',
		padding: 20,
		justifyContent: 'flex-end'
	},
	title: {
		fontWeight: 'bold',
			fontSize: 24,
			color: '#464a48'
	},
	subtitle: {
		fontWeight: 'bold',
		fontSize: 18,
		marginTop: -10,
		color: '#fff'
	}
})

export default MenuItem;
