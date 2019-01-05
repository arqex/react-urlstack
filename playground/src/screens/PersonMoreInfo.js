import React from 'react'
import {View, Text} from 'react-native'
import { getById } from '../data/testItems';
import { SharedElement } from 'react-urlstack';

export default function TestDetails( props ){
	let details = getById( props.location.params.id );
	let list = []

	Object.keys( details ).forEach( key => {
		list.push(
			<View key={ key }>
				<SharedElement sharedId="titleBar">
					<Text>Person more info</Text>
				</SharedElement>
				<Text>This is just a screen to test a third level</Text>
			</View>
		)
	})
	return (
		<View>
			{ list }
		</View>
	)
}