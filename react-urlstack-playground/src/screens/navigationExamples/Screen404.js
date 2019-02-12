import React from 'react'
import {View, Text} from 'react-native'

export default props => {
	return (
		<View>
			<Text>Sorry but we couldn't find what you were looking for. Are you sure you followed a valid link?</Text>
			<Text>If you clicked on the "Unexistant route" in the side menu, this is what you expected to see.</Text>
		</View>
	)
}