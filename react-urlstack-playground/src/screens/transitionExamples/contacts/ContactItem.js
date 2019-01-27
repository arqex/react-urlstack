import React from 'react'
import {View, Text, Image, StyleSheet, TouchableHighlight} from 'react-native'
import {SharedElement} from '../../../../react-urlstack'

export default function ContactItem( props ){
	return (
		<TouchableHighlight onPress={ props.onPress  }>
			<View style={ styles.container }>
				<View style={ styles.imageWrapper }>
					<Image source={ {uri: props.data.image } } style={ styles.image } />
				</View>
				<View style={ styles.textWrapper }>
					<View>
						<Text style={ styles.title }>{ props.data.name }</Text>
					</View>
					<View>
						<Text style={ styles.subtitle }>{ props.data.location }</Text>
					</View>
				</View>
			</View>
		</TouchableHighlight>
	)
}


const styles = StyleSheet.create({
	container:{
    padding: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
	},

  title: {
    fontSize: 18,
    fontWeight: '400',
	},
	
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#666'
	},
	
	imageWrapper:{
		width: 48, height: 48,
		borderRadius: 24,
		overflow: 'hidden',
		marginRight: 20
	},
	image: {
		width: 48, height: 48,
	}
})