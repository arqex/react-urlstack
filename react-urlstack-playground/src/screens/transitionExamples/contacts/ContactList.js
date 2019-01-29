import React from 'react'
import {View, Text, TouchableHighlight, FlatList} from 'react-native'
import ContactItem from './ContactItem';
import data from './contactData'

export default function ContactList( props ){
	let renderContactItem = function({item}){
		return (
			<ContactItem key={ 'i' + item.id } data={ item }
				onPress={ () => props.router.navigate(`/contacts/${item.id}`) }
				active={ item.id === props.location.params.id } />
		)
	}

	return (
		<View>
			<FlatList data={ data }
				renderItem={ renderContactItem }
			/>
		</View>
	)
}

ContactList.getTransition = function( breakPoint ){
	// Not returning anything means apply the default transition for other breakPoints
	// If we want to not animate the transitions just return false
	if( breakPoint !== 0 ) return;

	return {
		styles: {
			opacity: {
				inputRange: [-1, -0.3, 0, .3, 1],
				outputRange: [0, 0, 1, 0, 0]
			}
		},
		duration: 1000
	}
}