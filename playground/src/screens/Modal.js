import React from 'react'
import {View, Text, StyleSheet, Animated} from 'react-native'


function TestModal( props ){
	return (
		<View style={{height: '100%'}}>
			<Text>This is the modal's content</Text>
		</View>
	)
}

TestModal.navigatorOptions = {}

export default TestModal

let styles = StyleSheet.create({
	redSquare:{
		width: 40, height: 40,
		backgroundColor: 'red'
	},
	greenSquare:{
		position: 'absolute',
		left: 0, top: 500,
		width: '100%', height: 10,
		backgroundColor: 'green'
	},
	blueSquare:{
		position: 'absolute',
		left: 500, top: 0,
		width: 10, height: '100%',
		backgroundColor: 'blue'
	},
	pinkSquare: {
		position: 'absolute',
		left: 10, top: 10,
		width: 10, height: 10,
		backgroundColor: 'pink'
	},
	limeSquare: {
		width: 40, height: 40,
		backgroundColor: 'lime'
	}
})