import React, {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet, Animated} from 'react-native'
import data from './contactData'
import Icon from '../../../components/gallery/ui/Icon'

import {SharedElement} from '../../../../react-urlstack'
import avatarTransition from './avatarTransition'

const icons = {
	phone: 'phone',
	email: 'envelope-o',
	location: 'home'
}

export default class ContactDetails extends Component {
	constructor( props ){
		super(props)

		this.buttonAnimatedStyles = {
			transform: [{scale: props.indexes.transition.interpolate({
				inputRange: [-1, -.2, -.1, 0, 1 ],
				outputRange: [0, 0, 1.2, 1, 1]
			})}]
		}

		this.headerAnimatedStyles = {
			opacity: props.indexes.transition.interpolate({
				inputRange: [-1, -.2, -.18, 0 ],
				outputRange: [0, 0, 1, 1]
			})
		}

		this.detailsAnimatedStyles = {
			opacity: props.indexes.transition.interpolate({
				inputRange: [-1, -.3, -.1, 0 ],
				outputRange: [0, 0, 1, 1]
			})
		}
	}

	render() {
		let props= this.props;
		let contact = data[ parseInt(props.location.params.id) - 1 ];
	
		console.log( props.indexes )
	
		if( !contact ){
			return (
				<View><Text>No contact found for this id</Text></View>
			)
		}
	
		let list = ['phone', 'email', 'location'].map ( key => (
			<View style={ styles.detailItem } key={ key }>
				<View style={ styles.detailIcon }>
					<Icon name={ icons[key] } size={ 24 } color="#555" />
				</View>
				<Text style={ styles.detailText }>{ contact[key] }</Text>
			</View>
		))
	
		return (
			<View>
				<Animated.View style={ [styles.headWrapper, this.headerAnimatedStyles] }>
					<TouchableHighlight style={ styles.back } onClick={ () => props.router.navigate('/contacts') }>
						<View>
							<Icon name="arrow-left" color="#222" size={ 26 } />
						</View>
					</TouchableHighlight>
					<SharedElement sharedId={ `avatar_${ contact.id }` } style={ styles.imageWrapper } transitionState={2} transition={ avatarTransition }>
						<Image source={ {uri: contact.image} } style={ [styles.image] } />
					</SharedElement>
					<View style={ styles.textWrapper }>
						<View>
							<Text style={ styles.title }>{ contact.name }</Text>
						</View>
						<View>
							<Text style={ styles.subtitle }>{ contact.job }</Text>
						</View>
					</View>
				</Animated.View>
				<Animated.View style={ [styles.editButton, this.buttonAnimatedStyles] }>
					<Icon name="pencil" size={20} color="#fff" />
				</Animated.View>
				<Animated.View style={ styles.detailContainer }>
					<View style={ styles.detailList }>
						{ list }
					</View>
				</Animated.View>
			</View>
		)

	}
}

ContactDetails.getTransition = function( breakPoint ){
	// Not returning anything means apply the default transition for other breakPoints
	// If we want to not animate the transitions just return false
	if( breakPoint !== 0 ) return;

	return {
		styles: {
			opacity: {
				inputRange: [-1, -0.5, -0.2, 0.2, .5, 1],
				outputRange: [0, 0, 1, 1, 0, 0]
			}
		},
		duration: 1000
	}
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
		padding: 20,
		position: 'relative'
	},

	back: {
		position: 'absolute',
		top: 10, left: 20,
		width: 40, height: 40,
		zIndex: 12
	},

	imageWrapper: {
		position: 'absolute',
		top: 0, left: 0, bottom: 0, right: 0
	},

	editButton: {
		position: 'absolute',
		top: 175, right: 20,
		backgroundColor: '#34c',
		width: 50, height: 50,
		borderRadius: 25,
		overflow: 'hidden',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	image: {
		flex: 1,
		resizeMode: 'cover'
	},

  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#222'
	},
	
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#222'
	},

	detailContainer: {
		justifyContent: 'center',
		flexDirection: 'row',
		marginTop: 20
	},

	detailList: {
		maxWidth: 500,
		width: '100%',
		paddingLeft: 20, paddingRight: 20
	},

	detailItem: {
		flexDirection: 'row',
		marginBottom: 15
	},

	detailIcon: {
		width: 30,
		flexDirection: 'row',
		justifyContent: 'center'
	},

	detailText: {
		color: '#444',
		marginLeft: 10,
		fontSize: 18
	}
})