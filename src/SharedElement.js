import React, { Component } from 'react';
import { Animated } from 'react-native';
import { Context } from './utils/sharedElementContext';
import WrapperContext from './utils/wrapperContext';

console.log('Hola')

class SharedElement extends Component {
	constructor(props) {
		super(props);
		
		if( props.fromProps ){
			// We are in the transition layer, prepare the animation
			console.log('Amazing we got it!', props )
			this.animatedValue = new Animated.Value( props.fromIndex )
		}
		else {
			// We are mounted by the user, register the shared element
			this.props.se.register( this, props );
		}
	}

	render() {
		let style = this.props.style || {};
		if( this.props.transitioning ){
			style = { ...style, ...this.getTransitionStyle() }
		}

		console.log('Shared', this.props.se, this.props.wrapper );

		return (
			<Animated.View style={ style } onLayout={ e => this.box = e.nativeEvent.layout }>
				{ this.props.children }
			</Animated.View>
		);
	}

	getTransitionStyle(){
		if( this.transitionStyle ) return this.transitionStyle;


		if( !this.props.transitionStyle ){
			this.transitionStyle = this.boxInterpolator();
		}

		return this.transitionStyle;
	}

	boxInterpolator( animatedValue, fromIndex, toIndex, fromBox, toBox ){
		let styles = {};
		['top', 'left', 'width', 'height'].forEach( attr => {
			styles[ attr ] = this.interpolator( animatedValue, fromIndex, toIndex, fromBox[attr], toBox[attr] )
		});
		return styles;
	}

	interpolator( animatedValue, fromIndex, toIndex, fromValue, toValue ){
		if( fromValue === toValue ) return fromValue;
		let inverted = fromValue > toValue;
		return animatedValue.interpolate({
			inputRange: inverted ? [toIndex, toIndex, fromIndex, fromIndex] : [fromIndex, fromIndex, toIndex, toIndex],
			outputRange: inverted ? [toValue, toValue, fromValue, fromValue] : [fromValue, fromValue, toValue, toValue]
		})
	}

	componentDidMount(){
		if( this.animatedValue ){
			// We are in the transition layer, start the animation
			Animated.timing( this.animatedValue ,{
				toValue: this.props.toIndex,
				duration: 500
			}).start();
		}
	}
	
	componentWillUnmount(){
		this.props.se.unregister( this );
	}
}

function ContextConsumerHOC( Component ){
	return function SharedElementHOC( props ){
		console.log('HOC')
		return (
			<Context.Consumer>
				{ se => (
					<WrapperContext.Consumer>
						{ wrapper => (
							<Component {...props} se={se} wrapper={wrapper} />
						)}
					</WrapperContext.Consumer>
				)}
			</Context.Consumer>
		)
	}
}

export default ContextConsumerHOC( SharedElement )
