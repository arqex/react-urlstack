import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

class TestTabs extends Component {
	render(){	
		// console.log( this.props.router.location )
		return (
			<View style={ styles.container }>
				<View style={ styles.content }>{ this.props.children }</View>
				<View style={ styles.tabs }>
					<TouchableOpacity style={ styles.tab } onClick={ () => this.switchTab('tab1') }>
						<Text style={ styles.text }>One</Text>
					</TouchableOpacity>
					<TouchableOpacity style={ styles.tab } onClick={ () => this.switchTab('tab2') }>
						<Text style={ styles.text }>Two</Text>
					</TouchableOpacity>
					<TouchableOpacity style={ styles.tab } onClick={ () => this.switchTab('tab3') }>
						<Text style={ styles.text }>Three</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
	switchTab( tab ){
		let router = this.props.router
		let location = router.location
		let i = location.matches.length;
		while( i-- > 0 ){
			if( location.matches[i] === TestTabs ){
				return router.navigate( location.matchIds[i] + '/' + tab )
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
		flex:1
	},
	tabs: {
		width: '100%',
		height: 50,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#FEE'
	},
	tab: {
		flex: 1,
		alignContent:'center'
	},
	text: {
		textAlign: 'center',
		alignSelf: 'center'
	}


})