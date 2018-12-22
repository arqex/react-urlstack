import React, {Component} from 'react'
import MenuItem from './MenuItem'
import MenuGroup from './MenuGroup'
import MenuTitle from './MenuTitle'
import {View, StyleSheet} from 'react-native'

export default class SideMenu extends Component {
  constructor( props ){
    super( props )
    this._lastRoute = this.getRoute()
  }
  getRoute(){
    let l = this.props.router.location
    return l.pathname + l.search;
  }
  render() {
    let router = this.props.router;

    return (
      <View style={styles.menu}>
        <MenuTitle />
        <View>
          <MenuGroup title="Navigation examples">
            <MenuItem router={router} route="/">Welcome</MenuItem>
            <MenuItem router={router} route="/list">Basic stack</MenuItem>
            <MenuItem router={router} route="/tabs">Tab navigation</MenuItem>
            <MenuItem router={router} route="/modal">Modal</MenuItem>
            <MenuItem router={router} route="/unknown">Unexistant route</MenuItem>
          </MenuGroup>
        </View>
      </View>
    )
  }
  
  componentDidUpdate(){
    let nextRoute = this.getRoute()
    if( nextRoute !== this._lastRoute ){
      this._lastRoute = nextRoute
      this.props.drawer.close()
    }
  }
} 

const styles = StyleSheet.create({
  menu: {
    boxSizing: 'border-box',
    backgroundColor: '#e9eaea',
    flex: 1,
    width: 300
  }
})