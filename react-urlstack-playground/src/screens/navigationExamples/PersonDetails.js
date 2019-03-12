import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { getById } from './testItems'
import CollapsibleHeader from '../../components/CollapsibleHeader';
import Button from '../../components/gallery/ui/Button'
import Icon from '../../components/gallery/ui/Icon'
import DynamicHeaderList from '../../components/gallery/ui/DynamicHeaderList';


const icons = {
	id: 'hash',
	email: 'envelope-o'
}

export default function TestDetails( props ){
	let details = getById( props.location.params.id );

	let list = ['id', 'email'].map(key => (
		<View style={styles.detailItem} key={key}>
			<View style={styles.detailIcon}>
				<Icon name={icons[key]} size={24} color="#555" />
			</View>
			<Text style={styles.detailText}>{details[key]}</Text>
		</View>
	))

	let header = (
		<CollapsibleHeader
			title={details.name}
			subtitle="Second level of the stack" />
	)

	return (
		<DynamicHeaderList header={header}>
			<View style={styles.bodyContainer}>
				<View>
					{list}
				</View>
				<Button onPress={() => props.router.navigate(props.router.location.pathname + '/moreInfo')}>
					Load more details
			</Button>
			</View>
		</DynamicHeaderList>
	)
}

const styles = StyleSheet.create({
	bodyContainer: {
		padding: 10
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