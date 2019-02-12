import React from 'react'
import {View, Text} from 'react-native'
import { getById } from './testItems';
import ScreenHeader from '../../components/ScreenHeader';

export default function TestDetails( props ){
	let details = getById( props.location.params.id );
	let list = []

	Object.keys( details ).forEach( key => {
		list.push(
			<View key={ key }>
				<ScreenHeader title="Person more info" />
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