import PropTypes from "prop-types";
import React, { Component } from "react";
import {TouchableNativeFeedback, TouchableOpacity, TouchableHighlight, View, Platform} from 'react-native';

let isWeb = typeof window !== 'undefined' && !!window.document;

const touchableComponents = {
	native: TouchableNativeFeedback,
	opacity: TouchableOpacity,
	highlight: TouchableHighlight,
	default: Platform.OS === 'Android' ? TouchableNativeFeedback : TouchableOpacity,
	none: View
}

export default class Hoverable extends Component {
	static propTypes = {
		/** The children of the hoverable */
		children: PropTypes.node,
		/** Type of touchable used as a wrapper element for the content. The `default` one is using TouchableNativeFeedback for `android` and TouchableOpacity for others. */
		touchable: PropTypes.oneOf(['opacity', 'highlight', 'native', 'default', 'none']),
		/** Styles for the container when hovering */
		hoverCSS: PropTypes.string
	}

	static defaultProps = {
		touchable: 'default'
	}

	constructor(props){
		super(props)
		if( isWeb ){
			this.cn = props.id || 'h' + Math.round( Math.random() * 1000000 ).toString(36)
		}
	}

	render() {
		const { children, hoverCSS, touchable, ...touchableProps } = this.props;
		let css;

		if( this.cn ){
			touchableProps.className = this.cn
			css = (
				<style>{ `.${ this.cn }:hover { ${hoverCSS} }` }</style>
			)
		}

		let C = touchableComponents[touchable];

		console.log( touchableProps )

		return (
			<C { ...touchableProps }>
				{ children }
				{ css }
			</C>
		)
	}
}