import React, { Component } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import { Context } from './utils/sharedElementContext';
import WrapperContext from './utils/wrapperContext';
import PropTypes from 'prop-types'

const isWeb = Platform.OS === 'web';

const boxAttrs = {
	x: 'left',
	y: 'top',
	width: 'width',
	height: 'height'
}

class SharedElement extends Component {
	static popTypes = {
		active: PropTypes.boolean
	}

	static defaultTypes = {
		active: true
	}
	
	constructor(props) {
		super(props);
		
		if( props.fromProps ){
			// We are in the transition layer, prepare the animation
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

		return (
			<View style={ this.props.style }
				ref="el"
				onLayout={ () => this._onLayout() }
				pointerEvents="auto">
				{ this.props.children }
			</View>
		);
	}

	renderTransition(){
		let viewStyles = this.getTransitionStyle();
		
		return (
			<Animated.View style={ viewStyles.container } pointerEvents="auto">
				{ this.props.fromProps.children }
			</Animated.View>
		)
		/*
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
		*/
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
			left: 0,
			top: 0,
			width: box.width,
			height: box.height
		}
	}

	boxInterpolator( animatedLeaving, fromIndex, toIndex, fromBox, toBox ){
		let props = this.props;
		let getArgs = attr => ([
			animatedLeaving || this.animatedLeaving,
			fromIndex || props.fromIndex || 0,
			toIndex || props.toIndex || 0,
			(fromBox || props.fromBox)[attr],
			(toBox || props.toBox)[attr]
		])

		let styles = {
			width: this.interpolator.apply( this, getArgs('width') ),
			height: this.interpolator.apply( this, getArgs('height') ),
			transform: [
				{translateX: this.interpolator.apply( this, getArgs('x') )},
				{translateY: this.interpolator.apply( this, getArgs('y') )},
			]
		}

		return styles;
	}

	interpolator( animatedLeaving, fromIndex, toIndex, fromValue, toValue ){
		if( fromValue === toValue ) return fromValue;
		let inverted = fromIndex > toIndex;
		console.log( 'Interpolating', fromValue, toValue )
		return animatedLeaving.interpolate({
			inputRange: inverted ? [ toIndex, fromIndex ] : [ fromIndex, toIndex ],
			outputRange: inverted ? [ toValue, fromValue ] : [ fromValue, toValue ]
		})
	}

	componentDidMount(){
		if( this.animatedLeaving ){
			// We are in the transition layer, start the animation
			Animated.timing( this.animatedLeaving, {
				toValue: this.props.toIndex,
				duration: 1000
			}).start();
			
			Animated.timing( this.animatedEntering, {
				toValue: 0,
				duration: 1000
			}).start();
		}

		this.mounted = true;
	}
	
	componentWillUnmount(){
		if( this.registered ){
			this.props.se.unregister( this );
		}
	}

	measure( offset ){
		this.box = false;
		if( !isWeb && !this.layouted ){
			// We need the layout to calculate the measures properly in native
			console.log('skipping')
			return setTimeout( () => this.measure( offset ) );
		}
		
		this.refs.el && this.refs.el.measure( ( cx, cy, width, height, x, y ) => {
			this.box = {
				width, height,
				x: x - offset.x,
				y: y - offset.y
			};
			
			console.log('measured' );
		})
	}

	_onLayout(){
		this.layouted = true;
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
