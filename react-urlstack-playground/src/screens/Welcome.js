import React from 'react'
import { View, Text, Button } from 'react-native'

export default function WelcomeScreen( props ){
  console.log( props.drawer )
  return (
    <View>
      <Text>Welcome to the playground</Text>
      <Button onPress={ () => props.drawer.open() } title="Open drawer" />
    </View>
  )
}