import React, {Component} from 'react'
import {Text, View, StyleSheet} from 'react-native'
import Icon from './Icon'
import Hoverable from '../interactions/Hoverable'

export default class Button extends Component {
	render(){
		let { icon, children, style, textStyle, hoverStyle, transition, ...props } = this.props
		let content;
		if( typeof children === 'string' ){
			content = <Text style={ [ styles.text, textStyle ] }>{ children }</Text>
		}
		else {
			content = children
		}

		if( icon ){
			content = (
				<View style={ styles.iconWrapper }>
					<Icon name={ icon } /> { content }
				</View>
			)
		}
		return (
			<Hoverable accesibilityRole="button"
				style={[ styles.container, style ]}
				transition={ transition || 'background-color .3s' }
				hoverStyle={ hoverStyle || defaultHoverStyle }
				{ ...props}>
				{ content }
			</Hoverable> 
		)
	}
}

const defaultHoverStyle = `
	background-color: #31a6ff
`

const styles = StyleSheet.create({
	container:{
		backgroundColor: '#2196f3',
		borderRadius: 2,
		transition: '',
		padding: 10,
		flex: -1
	},

	iconWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},	

	text: {
		color: 'white',
		fontWeight: '500',
		textAlign: 'center'
	}
})


