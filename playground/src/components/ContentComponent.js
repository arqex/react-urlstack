import React from 'react'
import { View, Text } from 'react-native'

export default function( content ){
    return function ContentComponent(){
        return (
            <View><Text>{ content }</Text></View>
        )
    }
}