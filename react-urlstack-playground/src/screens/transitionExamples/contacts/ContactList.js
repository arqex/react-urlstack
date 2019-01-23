import React from 'react'
import {View, Text, TouchableHighlight, FlatList} from 'react-native'
import ContactItem from './ContactItem';
import data from './contactData'

export default function ConcatList( props ){
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