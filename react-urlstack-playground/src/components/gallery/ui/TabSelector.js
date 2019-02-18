import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from './Icon';
import Hoverable from '../interactions/Hoverable';

export default function TabSelector( props ){
	let tabs = props.items.map ( item => (
		<Hoverable style={[ styles.tab, props.tabStyle ]}
			hoverStyle={ props.tabHoverStyle }
			onPress={ () => props.onItemPress && props.onItemPress( item.id ) }
			key={ item.icon }
			>
			<Icon name={ item.icon } size={ props.iconSize || 24 } style={ [styles.icon, props.iconStyle] } />
			<Text style={ styles.text }>{ item.label }</Text>
		</Hoverable>
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