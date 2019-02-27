import React, { Component } from 'react';
import {  StyleSheet, Text, View, Button } from 'react-native';
import ListItem from '../../components/gallery/ui/ListItem';
import DynamicHeaderList from '../../components/gallery/ui/DynamicHeaderList';
import Icon from '../../components/gallery/ui/Icon';
import CollapsibleHeader from '../../components/CollapsibleHeader';
import {getItems} from './testItems';

class PersonList extends Component {
	constructor( props ) {
		super( props )
		this.state = {
			items: getItems()
		}
		
		this.baseUrl = props.baseUrl || '/list'
	}

	render() {
		let { items } = this.state;

		if (!items) {
			return this.renderNoQueue();
		}
		if (!items.length) {
			return this.renderNoArticles();
		}

		let header = (
			<CollapsibleHeader
				title="My header"
				leftContent={ <Icon size={20} color="white" name="chevron-left" /> }
				rightContent={ <Button title="Ok" onPress={ () => console.log('Click') } />}
				containerStyle={[ styles.header, styles.centered ] } />
		)

		return (
			<DynamicHeaderList containerType="flatList"
				data={items}
				header={ header }
				keyExtractor={ item => item.id + '' }
				renderItem={({ item }) => this.renderItem(item)} />
		)
	}

	renderNoQueue() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>There is no list available.</Text>
			</View>
		)
	}

	renderNoArticles() {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>There are no items yet.</Text>
			</View>
		)
	}

	renderItem(item) {
		let {router} = this.props;

		return (
			<View style={ styles.centered }>
				<ListItem key={item.id}
					title={item.name}
					subtitle={ item.email }
					onPress={ () => router.navigate( this.baseUrl+ '/' + item.id ) } />
			</View>
		)
	}

	openAddArticle() {
		let { queue } = this.props.data;
		this.props.navigation.push('addArticle', { queueId: queue.id })
	}
}

const styles = StyleSheet.create({
	text: {
		textAlign: 'center'
	},
	header: {
		backgroundColor: 'blue', flex: 1
	},
	centered: {
		maxWidth: 800,
		width: '100%',
		margin: 'auto'
	},
	bottomButton: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		right: 10
	},
})

export default PersonList;