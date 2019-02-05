import React from 'react'
import {View, Text, FlatList, StyleSheet, Animated} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckItem from './CheckItem';
import data from './checkData'

export default function CheckList( props ){
	
	let check = data[ parseInt(props.location.params.id) - 1 ];
	let headerStyles = [{
		transform: [{
			translateY: props.indexes.transition.interpolate({
				inputRange: [-1, -0.4, 0, 1],
				outputRange: [-500, -500, 0, 0]
			})
		}]},
		styles.header
	]

	let cardStyles = [{
		opacity: props.indexes.transition.interpolate({
			inputRange: [-1, -0.4, 0, 1],
			outputRange: [0, 0, 1, 1]
		})
	}, styles.card ]

	let renderTransactions = function({item}){
		return (
			<View key={ item.id } style={ styles.transContainer }>
				<View style={ styles.transLeft }>
					<Text style={ styles.transTitle }>{ item.title }</Text>
					<Text style={ styles.transDesc }>{ item.description }</Text>
				</View>
				<View style={ styles.transRight }>
					<Text style={ styles.transPrice}>{ item.price }</Text>
					<Icon name="chevron-right" color="#aaa" size={ 18 } />
				</View>
			</View>
		)
	}

	return (
		<View style={ styles.container }>
			<Animated.View style={ headerStyles }>
				<View style={ styles.titleWrapper }>
					<Icon name="arrow-left" size={ 22 } color="white" />
					<Text style={ styles.title }>Back</Text>
				</View>
				<View style={ styles.headerControls }>
					<Icon name="barcode" size={ 22 } color="white" />
				</View>
			</Animated.View>
			<View style={ styles.body }>
				<Animated.View style={ cardStyles }>
					<CheckItem data={ check } transitionState={ 2 } />
				</Animated.View>
				<FlatList data={ check.transactions }
					renderItem={ renderTransactions }
				/>
			</View>
			<View style={ styles.footer }>
				<View style={ [styles.footerIcon, styles.footerIconLeft] }>
					<Icon name="comment" size={ 22 } color="white" />
				</View>
				<View style={ [styles.footerIcon, styles.footerIconRight] }>
					<Icon name="credit-card" size={ 22 } color="white" />
				</View>
			</View>
		</View>
	)
}

CheckList.getTransition = function( breakPoint ){
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

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	header: {
		padding: 20,
		paddingTop: 35,
		flexDirection: 'row',
		marginBottom: 10,
		backgroundColor: '#247aff',
		height: 160
	},

	titleWrapper: {
		flexGrow: 1,
		flexDirection: 'row'
	},

	title: {
		fontSize: 18,
		color: '#fff',
		marginLeft: 10
	},

	body: {
		padding: 20,
		transform: [ {translateY: -100} ],
		flex: 1
	},
	
	headerControls: {
	},

	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 50,
		position: 'absolute',
		left: 0, bottom: 0,
		width: '100%'
	},

	footerIcon: {
		width: 50, height: 50,
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 40,
		marginRight: 40,
	},
	footerIconLeft: {
		backgroundColor: '#e81864',
	},
	footerIconRight: {
		backgroundColor: '#247aff',
	},

	transContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},

	transLeft:{
		flex: 1
	},
	transRight: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	transTitle: {
		fontWeight: '500'
	},
	transDesc: {
		color: '#aaa'
	},
	transPrice: {
		fontWeight: '600',
		fontSize: 16,
		marginRight: 10
	}
})