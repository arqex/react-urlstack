import React, { Component } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Context } from './utils/sharedElementContext';
import WrapperContext from './utils/wrapperContext';

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
			this.animatedLeaving = new Animated.Value( 0 )
			this.animatedEntering = new Animated.Value( -props.toIndex )
		}
		else if( props.wrapper ){
			// We are mounted by the user, register the shared element
			props.se.register( this, props );
			this.registered = true;
		}
		
		this.SE = SharedElement;
	}

	render() {
		if( this.animatedLeaving ) {
			return this.renderTransition();
		} 

		let viewStyles = [this.props.style];
		if( this.animatedLeaving ){
			viewStyles = viewStyles.concat([
				styles.position,
				this.props.fromBox,
				this.getTransitionStyle()
			])
		}

		// console.log('Shared', this.props.se, this.props.wrapper );

		return (
			<Animated.View style={ this.props.style }
				onLayout={ e => this._setBox(e) }
				pointerEvents="auto">
				{ this.props.children }
			</Animated.View>
		);
	}

	renderTransition(){
		let viewStyles = this.getTransitionStyle();

		return (
			<Animated.View style={ viewStyles.container } pointerEvents="auto">
				<Animated.View style={ viewStyles.leaving }>
					{ this.props.fromProps.children }
				</Animated.View>
				<Animated.View style={ viewStyles.entering }>
					{ this.props.toProps.children }
				</Animated.View>
			</Animated.View>
		)
	}

	getTransitionStyle(){
		if( this.transitionStyles ) return this.transitionStyles;
		let { transitionStyle, fromBox, toBox, fromProps, toProps, toIndex } = this.props;
		let st = {};

		let fb = this.boxToStyle( fromBox )
		let tb = this.boxToStyle( toBox )

		let containerStyles = transitionStyle ? 
			transitionStyle( this.animatedLeaving, toIndex, fromBox, toBox, fromProps, toProps ) : 
			this.boxInterpolator()
		;

		st.container = [
			styles.transition,
			this.props.style,
			fb,
			containerStyles
		];

		let leavingStyles = {};
		if( fromProps.contentTransition ){
			leavingStyles = fromProps.contentTransition( this.animatedLeaving, 0, toIndex, fb )
		}
		st.leaving = [
			styles.transition,
			fb,
			leavingStyles
		]

		let enteringStyles = {};
		if (fromProps.contentTransition) {
			enteringStyles = fromProps.contentTransition(this.animatedEntering, -toIndex, 0, tb )
		}
		st.entering = [
			styles.transition,
			tb,
			enteringStyles
		]

		return this.transitionStyles = st;
	}

	boxToStyle( box ){
		return {
			left: box.x,
			top: box.y,
			width: box.width,
			height: box.height
		}
	}

	_setBox( e ){
		this.props.wrapper && console.log( 'Setting box',  this.props.wrapper.id )
		this.box = e.nativeEvent.layout
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
		this.props.wrapper && console.log('Mounted', this.props.wrapper.id );
		
		if( this.animatedLeaving ){
			// We are in the transition layer, start the animation
			Animated.timing( this.animatedLeaving, {
				toValue: this.props.toIndex,
				duration: 500
			}).start();
			
			Animated.timing( this.animatedEntering, {
				toValue: 0,
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

const SharedElementWithContext = ContextConsumerHOC( SharedElement )
export default SharedElementWithContext
