import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default ( props ) => {
  return (
    <TouchableOpacity onPress={ e => props.onPress && props.onPress(e) }>
      <View style={ styles.container }>
        { optionalRender( props.leftContent, 'left' ) }
        <View style={ styles.texts }>
          <Text style={ styles.title }>{ props.title }</Text>
          { optionalRender( props.subtitle, 'subtitle', Text ) }
        </View>
        { optionalRender( props.rightContent, 'right' ) }
      </View>
    </TouchableOpacity>
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
  },

  texts: {
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