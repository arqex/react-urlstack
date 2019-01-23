import React from 'react'
import {View, Text, TouchableHighlight} from 'react-native'
import data from './contactData'

export default function ContactDetails( props ){
	let contact = data[ props.location.params.id ];

	if( !contact ){
		return (
			<View><Text>No contact found for this id</Text></View>
		)
	}

	return (
		<View>
			<Text>{ JSON.stringify( contact ) }</Text>
		</View>
	)
}