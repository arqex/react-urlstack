import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import ResponsiveWrapper from '../../components/ResponsiveWrapper'
import Screen from '../../components/Screen'

export default function WelcomeScreen( props ){
  return (
    <Screen>
      <ResponsiveWrapper>
        <Text>This is the first screen of the react-urlstack app. Swipe from the left to open the drawer.</Text>
        <Button onPress={ () => props.drawer.open() } title="Open drawer" />
      </ResponsiveWrapper>
    </Screen>
  )
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    alignItems: 'stretch'
	}
})