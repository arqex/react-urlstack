import React from 'react'
import {StyleSheet, View, Text, Platform} from 'react-native'
import {Navigator} from '../react-urlstack'
import routes from './routes'
import SideMenu from './components/menu/SideMenu'

if( Platform.OS === 'web' ){
  console.log('Requiring shit')
  require('./utils/loadIconFont')
}

export default function StackApp(props){
  return (
    <View style={ styles.container }>
      <Navigator routes={ routes }
        DrawerComponent={ SideMenu }
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
    backgroundColor: '#eee'
  }
})
