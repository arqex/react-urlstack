import React from 'react'
import {View, Text, Image, Button} from 'react-native'
import data from './contactData'
import { Ionicons } from '@expo/vector-icons';

export default function ContactDetails( props ){
	let contact = data[ props.location.params.id ];

	if( !contact ){
		return (
			<View><Text>No contact found for this id</Text></View>
		)
	}

	return (
		<View>
			<View style={ styles.imageWrapper }>
				<Image source={ contact.image } style={ styles.image } />
				<View style={ styles.textWrapper }>
					<View>
						<Text style={ styles.title }>{ props.data.name }</Text>
					</View>
					<View>
						<Text style={ styles.subtitle }>{ props.data.job }</Text>
					</View>
				</View>
			</View>
			<View style={ styles.editButton }>
				<Ionicons name="md-checkmark-circle" size={32} color="green" />
			</View>
			<Text>{ JSON.stringify( contact ) }</Text>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
    padding: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
	},

	image: {
		width: '100%', height: '100%',
	},

  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff'
	},
	
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#fff'
	},
})