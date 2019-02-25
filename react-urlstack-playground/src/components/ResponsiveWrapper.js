import React from 'react'
import { View, StyleSheet } from 'react-native'

export default function ResponsiveWrapper( props ){
  return (
    <View style={[ styles.container ]}>
			
			{ props.children }
    </View>
	)
}

const styles = StyleSheet.create({
	container: {
		maxWidth: 800,
		width: '100%',
		flex: 1,
    alignSelf: 'center'
	}
})