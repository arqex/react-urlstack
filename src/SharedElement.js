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
			this.animatedValue = new Animated.Value( props.fromIndex )
		}
		else if( props.wrapper ){
			// We are mounted by the user, register the shared element
			props.se.register( this, props );
			this.registered = true;
		}

		this.SE = SharedElement;
	}

	render() {
		let viewStyles = [this.props.style];
		if( this.animatedValue ){
			viewStyles = viewStyles.concat([
				styles.position,
				this.props.fromBox,
				this.getTransitionStyle()
			])
		}

		console.log('Shared', this.props.se, this.props.wrapper );

		return (
			<Animated.View style={ viewStyles }
				onLayout={ e => this.box = e.nativeEvent.layout }
				pointerEvents="auto">
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
		let props = this.props;
		['x', 'y', 'width', 'height'].forEach( attr => {
			styles[ boxAttrs[attr] ] = this.interpolator(
				animatedValue || this.animatedValue,
				fromIndex || props.fromIndex,
				toIndex || props.toIndex,
				(fromBox || props.fromBox)[attr],
				(toBox || props.toBox)[attr]
				)
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
		if( this.registered ){
			this.props.se.unregister( this );
		}
	}
}

const styles = StyleSheet.create({
	position: { position: 'absolute'}
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
