import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

export default function SideMenu(props) {
  return (
    <View style={styles.drawerStyles}>
      <Text>My drawer component</Text>
    </View>
  ) 
} 

const styles = StyleSheet.create({
  drawerStyles: {
    backgroundColor: '#ddd',
    top: 0, bottom: 0,
    width: 400,
    padding: 20
  }
})