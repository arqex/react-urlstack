import React, {Component} from 'react'
import MenuItem from './MenuItem'
import MenuGroup from './MenuGroup'
import MenuTitle from './MenuTitle'
import {View, StyleSheet} from 'react-native'

export default class SideMenu extends Component {
  constructor( props ){
    super( props )
    this._lastRoute = this.getRoute()
    this.onRouteUpdate = this.onRouteUpdate.bind( this );
    props.router.onChange( this.onRouteUpdate );
  }

  getRoute(){
    let l = this.props.router.location
    return l.pathname + l.search;
  }
  
  render() {
    let router = this.props.router;
    let currentRoute = router.location.pathname;

    return (
      <View style={styles.menu}>
        <MenuTitle />
        <View>
          <MenuGroup title="Navigation examples">
            <MenuItem router={router} active={ currentRoute === '/'} route="/">Welcome</MenuItem>
            <MenuItem router={router} active={ currentRoute.slice(0,5) === '/list'} route="/list">Basic stack</MenuItem>
            <MenuItem router={router} active={ currentRoute.slice(0,5) === '/tabs'} route="/tabs">Tab navigation</MenuItem>
            <MenuItem router={router} active={ currentRoute.slice(0,6) === '/modal'} route="/modal">Modal</MenuItem>
            <MenuItem router={router} active={ currentRoute.slice(0,8) === '/unknown'} route="/unknown">Unexistant route</MenuItem>
          </MenuGroup>
          
          <MenuGroup title="Transition examples">
            <MenuItem router={router} active={ currentRoute.slice(0,5) === '/contact'} route="/contacts">Contact list</MenuItem>
            <MenuItem router={router} active={ currentRoute.slice(0,5) === '/check'} route="/checks">Check list</MenuItem>
          </MenuGroup>
        </View>
      </View>
    )
  }

  onRouteUpdate(){
    let nextRoute = this.getRoute();
    if( this._lastRoute !== nextRoute ){
      this._lastRoute = nextRoute
      this.props.drawer.close()
    }
  }
} 

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#e9eaea',
    flex: 1,
    width: 300
  }
})