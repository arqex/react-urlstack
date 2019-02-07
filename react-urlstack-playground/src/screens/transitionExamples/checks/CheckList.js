import React from 'react'
import {View, Text, FlatList, StyleSheet, Animated} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckItem from './CheckItem';
import data from './checkData'

export default function CheckList( props ){
	let checkScale = {
		transform: [
			{scale: props.indexes.parent.transition.interpolate({
				inputRange: [ -1, -0.5, 0, 0.5, 1],
				outputRange: [ 1, .5 , 1, .5, 1]
			})}
		]
	}

	let renderCheckItem = function({item}){
		return (
			<Animated.View style={ checkScale } key={ 'i' + item.id }>
				<CheckItem data={ item }
					transitionState={ 1 }
					onPress={ () => props.router.navigate(`/checks/money/${item.id}`) }
					active={ item.id === props.location.params.id } />
			</Animated.View>
		)
	}

	return (
		<View style={ styles.container }>
			<View style={ styles.header }>
				<View style={ styles.titleWrapper }>
					<Text style={ styles.title }>My Checks</Text>
				</View>
				<View style={ styles.headerControls }>
					<Icon name="sort-amount-desc" size={ 22 } color="#247aff" style={ styles.icon } />
					<Icon name="file-text" size={ 22 } color="#247aff" style={ styles.icon } />
				</View>
			</View>
			<FlatList data={ data }
				renderItem={ renderCheckItem }
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 20
	},

	header: {
		flex: 1,
		flexDirection: 'row',
		marginBottom: 10,
		alignItems: 'center',
		padding: 5
	},

	titleWrapper: {
		flexGrow: 1,
	},

	title: {
		fontSize: 28,
		fontWeight: '600'
	},
	
	headerControls: {
		width: 90,
		flexDirection: 'row',
		alignItems: 'flex-end'
	},

	icon: {
		marginLeft: 20
	}
})