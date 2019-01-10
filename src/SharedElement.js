import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Context } from './utils/sharedElementContext';
import WrapperContext from './utils/wrapperContext';

console.log('Hola')

const boxAttrs = {
	x: 'left',
	y: 'top',
	width: 'width',
	height: 'height'
}

class SharedElement extends Component {
	constructor(props) {
		super(props);
		
		if( props.fromProps ){
			// We are in the transition layer, prepare the animation
			console.log('Amazing we got it!', props )
			this.animatedLeaving = new Animated.Value(props.fromIndex)
			this.animatedEntering = animatedLeaving.interpolate({
				inputRange: [-1, 0, 1],
				outputRange: [ 0, props.toIndex, 0]
			})

			this.SE = SharedElement;
		}
		else if( props.wrapper ){
			// We are mounted by the user, register the shared element
			props.se.register( this, props );
			this.registered = true;
		}

	}

	render() {
		if( this.animatedLeaving ) return this.renderTransition();

		let viewStyles = [this.props.style];
		if( this.animatedLeaving ){
			viewStyles = viewStyles.concat([
				styles.position,
				this.props.fromBox,
				this.getTransitionStyle()
			])
		}

		console.log('Shared', this.props.se, this.props.wrapper );

		return (
			<Animated.View style={ this.props.style }
				onLayout={ e => this.box = e.nativeEvent.layout }
				pointerEvents="auto">
				{ this.props.children }
			</Animated.View>
		);
	}

	renderTransition(){
		let viewStyles = {}
	}

	getTransitionStyle(){
		if( this.transitionStyles ) return this.transitionStyles;
		let { transitionStyle, contentTransition, fromBox, toBox, fromProps, toProps, fromIndex, toIndex } = this.props;
		let styles = {};

		let containerStyles = transitionStyle ? 
			transitionStyle( this.animatedLeaving, toIndex, fromBox, toBox, fromProps, toProps ) : 
			this.boxInterpolator()
		;

		styles.container = [
			this.props.style,
			styles.transition,
			fromBox,
			containerStyles
		];

		let leavingStyles = {};
		if( fromProps.contentTransition ){
			leavingStyles = fromProps.contentTransition( this.animatedLeaving, fromIndex, toIndex, fromBox )
		}
		styles.leaving = [
			styles.transition,
			fromBox,
			leavingStyles
		]

		let enteringStyles = {};
		if (fromProps.contentTransition) {
			enteringStyles = fromProps.contentTransition(this.animatedEntering, fromIndex, toIndex, fromBox)
		}
		styles.entering = [
			styles.transition,
			fromBox,
			enteringStyles
		]

		return this.transitionStyles = styles;
	}

	boxInterpolator( animatedLeaving, fromIndex, toIndex, fromBox, toBox ){
		let styles = {};
		let props = this.props;
		['x', 'y', 'width', 'height'].forEach( attr => {
			styles[ boxAttrs[attr] ] = this.interpolator(
				animatedLeaving || this.animatedLeaving,
				fromIndex || props.fromIndex,
				toIndex || props.toIndex,
				(fromBox || props.fromBox)[attr],
				(toBox || props.toBox)[attr]
				)
		});
		return styles;
	}

	interpolator( animatedLeaving, fromIndex, toIndex, fromValue, toValue ){
		if( fromValue === toValue ) return fromValue;
		let inverted = fromValue > toValue;
		return animatedLeaving.interpolate({
			inputRange: inverted ? [toIndex, toIndex, fromIndex, fromIndex] : [fromIndex, fromIndex, toIndex, toIndex],
			outputRange: inverted ? [toValue, toValue, fromValue, fromValue] : [fromValue, fromValue, toValue, toValue]
		})
	}

	componentDidMount(){
		if( this.animatedLeaving ){
			// We are in the transition layer, start the animation
			Animated.timing( this.animatedLeaving ,{
				toValue: this.props.toIndex,
				duration: 500
			}).start();
		}
	}
	
	componentWillUnmount(){
		if( this.registered ){
			this.props.se.unregister( this );
		}
	}
}

const styles = StyleSheet.create({
	transition: { position: 'absolute', overflow: 'hidden' }
})

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
