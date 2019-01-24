import React from 'react'
import {View, Text, Image, Button, StyleSheet} from 'react-native'
import data from './contactData'
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ContactDetails( props ){
	let contact = data[ props.location.params.id ];

	if( !contact ){
		return (
			<View><Text>No contact found for this id</Text></View>
		)
	}

	return (
		<View>
			<View style={ styles.headWrapper }>
				<View style={ styles.imageWrapper }>
					<Image source={ contact.image } style={ styles.image } />
				</View>
				<View style={ styles.textWrapper }>
					<View>
						<Text style={ styles.title }>{ contact.name }</Text>
					</View>
					<View>
						<Text style={ styles.subtitle }>{ contact.job }</Text>
					</View>
				</View>
			</View>
			<View style={ styles.editButton }>
				<Icon name="rocket" size={30} color="#900" />
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

	headWrapper: {
		width: '100%', height: 200,
		justifyContent: 'flex-end',
		padding: 20
	},

	imageWrapper: {
		position: 'absolute',
		top: 0, left: 0, bottom: 0, right: 0
	},

	editButton: {
		position: 'absolute',
		top: 180, right: 20,
		background: '#fff',
		width: 40, height: 40,
		borderRadius: 20,
		overflow: 'hidden',
		flex: 1,
		justifyContent: 'center'
	},

	image: {
		flex: 1,
		resizeMode: 'cover'
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