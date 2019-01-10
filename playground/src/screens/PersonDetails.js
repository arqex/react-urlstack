import React from 'react'
import {View, Text, TouchableHighlight} from 'react-native'
import { getById } from '../data/testItems'
import ScreenHeader from '../components/ScreenHeader';

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
			<ScreenHeader title="Person details" />
			{ list }
			<TouchableHighlight onPress={ () => props.router.navigate( props.router.location.pathname + '/moreInfo') }>
				<Text>More details</Text>
			</TouchableHighlight>
		</View>
	)
}