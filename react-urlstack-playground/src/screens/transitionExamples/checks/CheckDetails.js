import React from 'react'
import {View, Text, FlatList, StyleSheet, Animated, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckItem from './CheckItem';
import data from './checkData'
import {stagger} from '../../../../react-urlstack'

export default function CheckDetails( props ){
	let animatedValue = props.indexes.transition

	let check = data[ parseInt(props.location.params.id) - 1 ];
	let headerStyles = [{
		transform: [{
			translateY: animatedValue.interpolate({
				inputRange: [-1, -0.4, 0, 1],
				outputRange: [-500, -500, 0, 0]
			})
		}]},
		styles.header
	]

	let cardStyles = [{
		opacity: animatedValue.interpolate({
			inputRange: [-1, -0.4, 0, 1],
			outputRange: [0, 0, 1, 1]
		})
	}, styles.card ]


	let stages = stagger(animatedValue, .05, 5, {
		opacity: {
			inputRange: [-1, -0.35, -0.2, 0],
			outputRange: [0, 0, 1, 1]
		},
		translateX: {
			inputRange: [-1, -0.35, -0.2, 0],
			outputRange: [-50, -50, 0, 0]
		}
	})

	let i = 0

	let renderTransactions = function({item}){
		return (
			<Animated.View style={ [styles.transContainer, stages[i++]] }>
				<View style={ styles.transLeft }>
					<Text style={ styles.transTitle }>{ item.title }</Text>
					<Text style={ styles.transDesc }>{ item.description }</Text>
				</View>
				<View style={ styles.transRight }>
					<Text style={ styles.transPrice}>{ item.price }</Text>
					<Icon name="chevron-right" color="#aaa" size={ 18 } />
				</View>
			</Animated.View>
		)
	}

	let buttonStages = stagger( animatedValue, .1, 2, {
		translateY: {
			inputRange: [ -1, -.3, -.1, 0 ],
			outputRange: [ 100, 100, 0, 0 ]
		}
	})

	return (
		<View style={ styles.container }>
			<Animated.View style={ headerStyles }>
				<View style={styles.titleWrapper}>
					<TouchableHighlight onPress={() => props.router.navigate('/checks/money')}>
						<View style={styles.titleWrapper}>
							<Icon name="arrow-left" size={22} color="white" />
							<Text style={styles.title}>Back</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={ styles.headerControls }>
					<Icon name="barcode" size={ 22 } color="white" />
				</View>
			</Animated.View>
			<Animated.View style={ cardStyles }>
				<CheckItem data={ check } transitionState={ 2 } />
			</Animated.View>
			<View style={ styles.body }>
				<FlatList data={ check.transactions }
					keyExtractor={ (item) => item.id }
					renderItem={ renderTransactions }
					ListFooterComponent={ <View key="fooo" style={{height: 100}} /> }
				/>
			</View>
			<View style={ styles.footer }>
				<Animated.View style={ [styles.footerIcon, styles.footerIconLeft, buttonStages[1]] }>
					<Icon name="comment" size={ 22 } color="white" />
				</Animated.View>
				<Animated.View style={ [styles.footerIcon, styles.footerIconRight, buttonStages[0]] }>
					<Icon name="credit-card" size={ 22 } color="white" />
				</Animated.View>
			</View>
		</View>
	)
}

CheckDetails.getTransition = function( breakPoint ){
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
		duration: 800
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
		flexDirection: 'row',
		alignItems: 'flex-start'
	},

	title: {
		fontSize: 18,
		color: '#fff',
		marginLeft: 10
	},

	body: {
		flex: 1,
		paddingTop: 90
	},

	card: {
		position: 'absolute',
		top: 100,
		left: 0, right: 0
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
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 30,
		paddingRight: 30,
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