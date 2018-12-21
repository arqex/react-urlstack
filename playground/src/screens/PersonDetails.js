import React from 'react'
import {View, Text, TouchableHighlight} from 'react-native'
import { getById } from '../data/testItems'

export default function TestDetails( props ){
	let details = getById( props.location.params.id );
	let list = []

	Object.keys( details ).forEach( key => {
		list.push(
			<View key={ key }>
				<Text>{ key }</Text>
				<Text>{ details[key] }</Text>
			</View>
		)
	})

	return (
		<View>
			{ list }
			<TouchableHighlight onPress={ () => props.router.navigate( props.router.location.pathname + '/moreDetails') }>
				<Text>More details</Text>
			</TouchableHighlight>
		</View>
	)
}