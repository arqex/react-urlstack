import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'

export default function SideMenu(props) {
  let router = props.router;

  return (
    <View style={styles.menu}>
      <Text>React URL Stack</Text>
      <View>
        <TouchableHighlight style={ styles.menuItem } onClick={ () => router.push('/')}>
          <Text>Welcome</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.menuItem } onClick={ () => router.push('/list')}>
          <Text>Basic stack</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.menuItem } onClick={ () => router.push('/tabs')}>
          <Text>Tab navigation</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.menuItem } onClick={ () => router.push('/simpleScreen')}>
          <Text>Simple screen</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ styles.menuItem } onClick={ () => router.push('/modal')}>
          <Text>Open modal</Text>
        </TouchableHighlight>
      </View>
    </View>
  ) 
} 

const styles = StyleSheet.create({
  menu: {
    boxSizing: 'border-box',
    backgroundColor: '#ddd',
    flex: 1,
    width: 300,
    padding: 20
  }
})