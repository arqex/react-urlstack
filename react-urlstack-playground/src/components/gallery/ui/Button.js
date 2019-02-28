import React, {Component} from 'react'
import {Text, View, StyleSheet} from 'react-native'
import Icon from './Icon'
import Hoverable from '../interactions/Hoverable'
import PropTypes from 'prop-types'

export default class Button extends Component {
	static propTypes = {
		primaryColor: PropTypes.string,
		secondaryColor: PropTypes.string,
		filled: PropTypes.bool,
		icon: PropTypes.string
	}

	static defaultProps = {
		primaryColor: '#2196f3',
		secondaryColor: '#fff',
		filled: true,
	}

	constructor( props ){
		super( props )
		this.state = {
			focus: false
		}
	}

	render(){
		let { icon, children, style, textStyle, hoverStyle, transition, primaryColor, secondaryColor, filled, ...props } = this.props
		let textColor = filled ? secondaryColor : primaryColor;
		let bgColor = filled ? primaryColor : 'transparent';
		let content;

		if( typeof children === 'string' ){
			content = <Text style={ [ {color: textColor}, styles.text, textStyle ] }>{ children }</Text>
		}
		else {
			content = children
		}

		if( icon ){
			content = (
				<View style={ styles.textWrapper }>
					<View style={ [ styles.iconWrapper, !children && styles.iconOnlyWrapper ] }>
						<Icon name={ icon } color={ textColor } size={18} />
					</View>{ content }
				</View>
			)
		}
		return (
			<Hoverable accesibilityRole="button"
				onBlur={ () => this.setState({focus: false}) }
				onFocus={ () => this.setState({focus: true}) }
				style={[ { backgroundColor: bgColor }, styles.container, this.state.focus && styles.focus, style ]}
				transition={ transition || 'background-color .3s' }
				hoverStyle={ hoverStyle || (filled ? defaultHoverFilled : defaultHoverTransparent ) }
				{ ...props}>
				{ content }
			</Hoverable> 
		)
	}
}

const defaultHoverFilled = `
	background-color: #31a6ff !important
`

const defaultHoverTransparent = `
	background-color: rgba( 0, 0, 100, .06 ) !important
`

const styles = StyleSheet.create({
	container:{
		borderRadius: 2,
		padding: 7,
		flex: -1,
		borderWidth: 3,
		borderColor: 'transparent'
	},

	focus: {
		borderColor: 'rgba(0,0,0,.2)',
	},

	textWrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	iconWrapper: {
		marginRight: 8
	},

	iconOnlyWrapper: {
		marginRight: 0
	},

	text: {
		fontWeight: '500',
		textAlign: 'center'
	}
})


