import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Hoverable from '../interactions/Hoverable'

export default ( props ) => {
  let mainContent = props.mainContent;

  if( !mainContent ){
    mainContent = (
      <View style={ [ styles.mainContent, props.mainStyle ] }>
        <Text style={ styles.title }>{ props.title }</Text>
        { optionalRender( props.subtitle, 'subtitle', Text ) }
      </View>
    )
  }

  let containerStyle = [
    styles.container, props.containerStyle
  ]
  
  return (
    <Hoverable onPress={ e => props.onPress && props.onPress(e) } style={ containerStyle } hoverStyle={ props.hoverStyle } >
      { optionalRender( props.leftContent, 'left' ) }
      { mainContent }
      { optionalRender( props.rightContent, 'right' ) }
    </Hoverable>
  )
}


function optionalRender( content, style, Component = Text ){
  if( !content ) return
  return (
    <Component style={ style[style] }>{ content }</Component>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center'
  },

  mainContent: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
  },

  leftContent: {
  },

  rightContent: {
  },

  title: {
    fontSize: 16,
    fontWeight: '400',
  },
  
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#666'
  }
})