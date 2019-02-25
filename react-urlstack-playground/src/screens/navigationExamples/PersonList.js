import React, { Component } from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import ListItem from '../../components/gallery/ui/ListItem';
import DynamicHeaderList from '../../components/gallery/ui/DynamicHeaderList';
import ScreenHeader from '../../components/ScreenHeader';
import ResponsiveWrapper from '../../components/ResponsiveWrapper'
import Screen from '../../components/Screen'
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

		return (
			<Screen style={styles.container}>
				<ResponsiveWrapper>
					<ScreenHeader title="Person list" active={ this.props.breakPoint === 0 } />
					<DynamicHeaderList containerType="flatList"
						data={items}
						header={ <View style={{backgroundColor: 'blue', flex: 1, width: '100%'}} /> }
						keyExtractor={ item => item.id + '' }
						renderItem={({ item }) => this.renderItem(item)} />
				</ResponsiveWrapper>
			</Screen>
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
			<ListItem key={item.id}
				title={item.name}
				subtitle={ item.email }
				onPress={ () => router.navigate( this.baseUrl+ '/' + item.id ) } />
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
	bottomButton: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		right: 10
	}
})

export default PersonList;