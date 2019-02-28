import React, {Component} from 'react'
import { Animated, ScrollView, FlatList, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';

let AnimatedFL = Animated.createAnimatedComponent( FlatList )

export default class DynamicHeaderList extends Component {
	static propTypes = {
		minHeaderHeight: PropTypes.number,
		maxHeaderHeight: PropTypes.number,
		containerType: PropTypes.oneOf(['flatList', 'scrollView']),
		header: PropTypes.element
	}

	static defaultProps = {
		minHeaderHeight: 80,
		maxHeaderHeight: 220,
		containerType: 'scrollView'
	}

	constructor( props ){
		super( props )
		
		this.scroll = new Animated.Value(0)		
		
		let diff = props.maxHeaderHeight - props.minHeaderHeight;
		this.headerHeight = this.scroll.interpolate({
			inputRange: [-1, 0, diff, diff + 1],
			outputRange: [props.maxHeaderHeight, props.maxHeaderHeight, props.minHeaderHeight, props.minHeaderHeight]
		})

		this._onScrollEnd = this._onScrollEnd.bind( this );

		this.listDefaultProps = {
			scrollEventThrottle: 16, // <-- Use 1 here to make sure no events are ever missed
			onScrollEndDrag: this._onScrollEnd,
			onMomentumScrollEnd: this._onScrollEnd,
			onScroll: this._onScroll()
		}

		// Transition should go from 0->1 : minHeaderHeight->maxHeaderHeight
		this.transition = Animated.divide(
			Animated.add( this.headerHeight, -(props.minHeaderHeight) ),
			diff
		)

		this.state = {
			headerWidth: '100%'
		}
	}

	render() {
		let { header, containerType, minHeaderHeight, maxHeaderHeight, children, ...listProps} = this.props;
		let placeholder = <View style={{height: maxHeaderHeight}} onLayout={ e => this.setState({headerWidth: e.nativeEvent.layout.width}) } />

		let list;
		if( containerType === 'flatList' ){
			list = (
				<AnimatedFL 
					ListHeaderComponent={ placeholder }
					{ ...this.listDefaultProps }
					{ ...listProps } />
			)
		}
		else {
			list = (
				<ScrollView
					{ ...this.listDefaultProps }
					{ ...listProps }>
					{ placeholder }
					{children}
				</ScrollView>
			)
		}
		
		return (
			<View style={ styles.container }>
				<Animated.View style={[ {height: this.headerHeight, width: this.state.headerWidth}, styles.header]}>
					{ React.cloneElement(this.props.header, {transition: this.transition}) }
				</Animated.View>
				<View style={ styles.listContainer }>
					{ list }
				</View>
			</View>
		)
	}

	_onScroll(){
		return Animated.event([{
			nativeEvent: {
				contentOffset: { y: this.scroll }
			}
		}])
	}

	_onScrollEnd( e ){
		console.log( e )
	}
}

let styles = StyleSheet.create({
	container: {
		position: 'relative',
		flex: 1
	},

	header: {
		position: 'absolute',
		top: 0, left: 0,
		zIndex: 1,
		flex: 1
	},

	listContainer: {
		flex: 1
	}
})