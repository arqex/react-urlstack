import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {Navigator} from 'react-urlstack'
import routes from './routes'

export default function StackApp(props){
  return (
    <View style={ styles.container }>
      <Navigator routes={ routes }
        store={ props.store }
        DrawerComponent={ DrawerComponent }
        transitionTime={ 1000 } /> 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 1,
  }
})
