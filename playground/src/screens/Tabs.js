import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

function TestTabs( props ){
	let router = props.router

	return (
		<View style={ styles.container }>
			<View style={ styles.content }>{ props.content }</View>
			<View style={ styles.tabs }>
				<TouchableOpacity style={ styles.tab } onClick={ () => router.push('/testTabs/tab1') }>
					<Text style={ styles.text }>One</Text>
				</TouchableOpacity>
				<TouchableOpacity style={ styles.tab } onClick={ () => router.push('/testTabs/tab2') }>
					<Text style={ styles.text }>Two</Text>
				</TouchableOpacity>
				<TouchableOpacity style={ styles.tab } onClick={ () => router.push('/testTabs/tab3') }>
					<Text style={ styles.text }>Three</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

TestTabs.urlstackOptions = { tabs: true };

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