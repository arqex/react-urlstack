import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import ListItem from '../components/ListItem';
import {getItems} from '../data/testItems';

class TestList extends Component {
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

		return (
			<View style={styles.container}>
				<FlatList data={items}
					renderItem={({ item }) => this.renderItem(item)} />
			</View>
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
				{this.renderButton()}
			</View>
		)
	}

	renderButton() {
		return (
			<View style={styles.bottomButton}>
				<Button onPress={() => this.openAddArticle()} text="Add a new item" />
			</View>
		)
	}

	renderItem(item) {
		let {router} = this.props;

		return (
			<ListItem key={item.id}
				title={item.name}
				subtitle={ item.email }
				onPress={ () => router.push( this.baseUrl+ '/' + item.id ) } />
		)
	}

	openAddArticle() {
		let { queue } = this.props.data;
		console.log(this.props);
		console.log('Open the modal here');
		this.props.navigation.push('addArticle', { queueId: queue.id })
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	text: {
		textAlign: 'center'
	},
	bottomButton: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		right: 10
	}
})

export default TestList;