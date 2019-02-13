import React from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';


export default function TabSelector( props ){
	let tabs = props.items.map ( item => (
		<TouchableHighlight style={styles.tab} onPress={ () => props.onItemPress( item.id ) } key={ item.icon }>
			<View style={ styles.tab }>
				<Icon name={ item.icon } size={24} style={ styles.icon } />
				<Text style={ styles.text }>{ item.label }</Text>
			</View>
		</TouchableHighlight>
	))

	return (
		<View style={ styles.container }>
			{ tabs }
		</View>
	)
}

let styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#f6f6f6',
		borderTopWidth: 3,
		borderTopColor: '#f0f0f0'
	},

	tab: {
		flex: 1,
		padding: 3
	},

	icon: {
		color: '#aaa',
		textAlign: 'center'
	},

	text: {
		color: '#aaa',
		fontSize: 12,
		textAlign: 'center'

	}
})