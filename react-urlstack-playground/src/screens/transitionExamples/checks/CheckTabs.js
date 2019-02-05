import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import TabSelector from '../../../components/TabSelector'

class TestTabs extends Component {
	render() {
		let tabItems = [
			{ id: 'inbox', label: 'Inbox', icon: 'inbox' },
			{ id: 'currencies', label: 'Currencies', icon: 'globe' },
			{ id: 'money', label: 'Checks', icon: 'credit-card' },
			{ id: 'share', label: 'Share', icon: 'share' },
			{ id: 'settings', label: 'Settings', icon: 'cog'},
		]

		// console.log( this.props.router.location )
		return (
			<View style={styles.container}>
				<View style={styles.content}>{this.props.children}</View>
				<View style={styles.tabs}>
					<TabSelector items={ tabItems }
						onItemPress={ id => this.props.router.navigate('/checks/' + id ) } />
				</View>
			</View>
		)
	}
	switchTab(tab) {
		let router = this.props.router
		let location = router.location
		let i = location.matches.length;
		while (i-- > 0) {
			if (location.matches[i] === TestTabs) {
				return router.navigate(location.matchIds[i] + '/' + tab)
			}
		}
	}
}

TestTabs.navigationOptions = {};

export default TestTabs;

let styles = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		flex: 1
	},
	tabs: {
		width: '100%'
	},
	tab: {
		flex: 1,
		alignContent: 'center'
	},
	text: {
		textAlign: 'center',
		alignSelf: 'center'
	}


})