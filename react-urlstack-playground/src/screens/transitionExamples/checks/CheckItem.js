import React from 'react'
import {View, Text, Image, StyleSheet, TouchableHighlight} from 'react-native'
import {SharedElement} from '../../../../react-urlstack'
import checkTransition from './checkTransition'
import Icon from 'react-native-vector-icons/FontAwesome';

const iconNames = {
	Received: 'check-square',
	'Not received': 'warning',
	Error: 'times-circle'
}

const iconColors = {
	Received: '#247aff',
	'Not received': 'orange',
	Error: 'red'
}

export default function CheckItem( props ){
	return (
		<TouchableHighlight onPress={ props.onPress }>
			<View>
				<SharedElement sharedId={ `avatar_${ props.data.id }` } transitionState={ props.transitionState } transition={ checkTransition }>
					<View style={ styles.container }>
						<View style={ styles.titleBar }>
							<View style={ styles.logo }>
								<Image source={{uri: props.data.img}} style={ styles.image } />
							</View>
							<View style={ styles.titleWrapper }>
								<Text style={ styles.title }>
									{ props.data.name }
								</Text>
							</View>
							<View style={ styles.statusIcon }>
								<Icon name={ iconNames[ props.data.status ] } color={ iconColors[ props.data.status ] } size={20} />
							</View>
						</View>
						<View style={ styles.detailBar }>
							<View style={ styles.detail }>
								<Text style={ styles.detailTitle}>Amount</Text>
								<Text style={ [styles.detailValue, styles.detailTotal] }>{ props.data.total }</Text>
							</View>
							<View style={ styles.detail }>
								<Text style={ styles.detailTitle}>Date</Text>
								<Text style={ [styles.detailValue] }>{ props.data.date }</Text>
							</View>
							<View style={ styles.detail }>
								<Text style={ styles.detailTitle}>Status</Text>
								<Text style={ [styles.detailValue] }>{ props.data.status }</Text>
							</View>
						</View>

					</View>
				</SharedElement>
			</View>
		</TouchableHighlight>
	)
}


const styles = StyleSheet.create({
	container:{
    padding: 20,
    backgroundColor: 'white',
    borderBottomColor: '#eee',
		borderBottomWidth: 1,
		borderRadius: 10,
		marginBottom: 10,
		elevation: 10,
		height: 145
	},

	titleBar:{
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20
	},

	titleWrapper: {
		flex: 1,
		marginLeft: 20
	},

  title: {
    fontSize: 20,
		fontWeight: '500'
	},

	statusIcon: {
	},

	
 	detailBar:{
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},

	detail: {
		flex: 1
	},

	detailTitle: {
		color: '#777',
		fontSize: 16
	},

	detailValue: {
		fontWeight: '400',
		fontSize: 16
	},

	detailTotal: {
		fontWeight: '600'
	},

	logo: {
		width: 48, height: 48
	},

	image: {
		width: 48, height: 48,
	},
})