import isHoverEnabled from "./hoverState";
import { element, func, oneOf, oneOfType, object, array } from "prop-types";
import React, { Component } from "react";
import {TouchableNativeFeedback, TouchableOpacity, TouchableHighlight} from 'react-native';

const touchableComponents = {
	native: TouchableNativeFeedback,
	opacity: TouchableOpacity,
	highlight: TouchableHighlight
}

export default class Hoverable extends Component {
	constructor(props) {
		super(props);
		this.state = { isHovered: false, showHover: true };
		this._handleMouseEnter = this._handleMouseEnter.bind(this);
		this._handleMouseLeave = this._handleMouseLeave.bind(this);
		this._handleGrant = this._handleGrant.bind(this);
		this._handleRelease = this._handleRelease.bind(this);
	}

	_handleMouseEnter(e) {
		if (isHoverEnabled() && !this.state.isHovered) {
			this.props.onHoverIn();
			this.setState({isHovered: true });
		}
	}

	_handleMouseLeave(e) {
		if (this.state.isHovered) {
			this.props.onHoverOut();
			this.setState({isHovered: false });
		}
	}

	_handleGrant() {
		this.setState({showHover: false });
	}

	_handleRelease() {
		this.setState({showHover: true });
	}

	_getStyle( style, hoverStyle ) {
		let merged = [];

		if( style ){
			if( style.splice ){
				merged = style
			}
			else {
				merged.push( style )
			}
		}
		if( hoverStyle && this.state.showHover && this.state.isHovered ){
			if( hoverStyle.splice ){
				merged = merged.concat( hoverStyle )
			}
			else {
				merged.push( hoverStyle )
			}
		}

		return merged;
	}

	render() {
		const { children, onHoverIn, onHoverOut, touchable, style, hoverStyle, ...touchableProps } = this.props;
		touchableProps.onMouseEnter = this._handleMouseEnter;
		touchableProps.onMouseLeave = this._handleMouseLeave;

		// prevent hover showing while responder
		touchableProps.onResponderGrant = this._handleGrant;
		touchableProps.onResponderRelease = this._handleRelease;
		touchableProps.onPressIn = this._handleGrant;
		touchableProps.onPressOut = this._handleRelease;

		touchableProps.style = this._getStyle( style, hoverStyle );

		return React.createElement( touchableComponents[touchable], touchableProps, children );
	}
}

Hoverable.displayName = "Hoverable";

Hoverable.propTypes = {
	children: oneOfType([func, element]),
	onHoverIn: func,
	onHoverOut: func,
	touchable: oneOf(['opacity', 'highlight', 'native']),
	hoverStyle: oneOfType([object, array])
};

const nofn = function(){}
Hoverable.defaultProps = {
	onHoverIn: nofn,
	onHoverOut: nofn,
	touchable: 'opacity'
}