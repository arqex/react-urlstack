import React from 'react'
import { View, Text, Button } from 'react-native'

export default function WelcomeScreen( props ){
  return (
    <View>
      <Text>This is the first screen of the react-urlstack app. Swipe from the left to open the drawer.</Text>
      <Button onPress={ () => props.drawer.open() } title="Open drawer" />
    </View>
  )
}