import React, { Component } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import TabSelector from '../../../components/TabSelector'

class CheckTabs extends Component {
	constructor( props ){
		super( props )
		this.tabStyles = {
			transform: [
				{
					translateY: props.indexes.transition.interpolate({
						inputRange: [-1, -0.5, 0, 0.5, 1],
						outputRange: [100, 100, 0, 100, 100]
					})
				}
			]
		}
	}
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
				<Animated.View style={[styles.tabs, this.tabStyles]}>
					<TabSelector items={ tabItems }
						onItemPress={ id => this.props.router.navigate('/checks/' + id ) } />
				</Animated.View>
			</View>
		)
	}
}

CheckTabs.navigationOptions = {};

export default CheckTabs;

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


CheckTabs.getTransition = function (breakPoint) {
	// Not returning anything means apply the default transition for other breakPoints
	// If we want to not animate the transitions just return false
	if (breakPoint !== 0) return;

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