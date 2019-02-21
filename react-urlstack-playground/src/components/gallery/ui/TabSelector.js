import React, {Component} from 'react'
import { View, Text, StyleSheet, Dimensions, Animated, Platform, ScrollView } from 'react-native'
import PropTypes from 'prop-types';
import Icon from './Icon';
import Hoverable from '../interactions/Hoverable';

export default class TabSelector extends Component {
	static propTypes = {
		items: PropTypes.array,
		minTabWidth: PropTypes.number,
		iconSize: PropTypes.number,
		/** Styles for the container when hovering */
		tabHoverStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
	}
	static defaultProps = {
		items: [],
		minTabWidth: 80,
		tabHoverStyle: {
			tabText: "color: #666",
			tabIcon: "color: #666"
		}
	}

	constructor( props ){
		super( props )
		this._onLayout = this._onLayout.bind( this )

		let barWidth = Dimensions.get('window').width
		this.state = {
			width: barWidth,
			itemWidth: barWidth / props.items.length
		}

		this.currentIndex = this.getCurrentIndex( props );
		this.animatedBar = new Animated.Value( this.getCurrentBarX( props ) )
	}

	render() {
		let props = this.props;

		let tabs = this.renderTabsAndIndex( props );

		let containerStyles = [
			styles.container,
			props.containerStyle,
			{ width: Math.max(this.state.width, props.minTabWidth * props.items.length) }
		]
	
		return (
			<ScrollView	onLayout={ e => this._onLayout( e.nativeEvent.layout ) }
				style={{overflowX: 'hidden', overflowY: 'hidden'}}
				horizontal ref={ el => this.scroll = el }
				showsHorizontalScrollIndicator={ false }
				showsVerticalScrollIndicator={ false }>
				<View style={ containerStyles }>
					{ this.renderCurrentBar( tabs.currentIndex ) }
					{ tabs.items }
				</View>
			</ScrollView>
		)
	}

	renderTabsAndIndex( props ){
		let currentIndex;

		let tabs = props.items.map( (item, i) => {
			let isCurrent = item.id === props.current;
			if( isCurrent ){
				currentIndex = i;
			}

			return (
				<Hoverable style={[ styles.tab, props.tabStyle, isCurrent && props.currentTabStyle ]}
					hoverStyle={ props.tabHoverStyle }
					onPress={ () => props.onTabPress && props.onTabPress( item ) }
					key={ item.icon }
				>
					<Icon className="tabIcon" name={ item.icon } size={ props.iconSize || 24 } style={ [styles.icon, props.iconStyle, isCurrent && props.currentIconStyle] } />
					<Text className="tabText" style={ [styles.text, props.textStyle, isCurrent && props.currentTextStyle] }>{ item.label }</Text>
				</Hoverable>
			)
		})

		return {
			items: tabs,
			currentIndex
		}
	}

	renderCurrentBar( currentIndex ){
		if( currentIndex === undefined ) return;
		
		let style= [
			styles.currentBar,
			this.props.currentBarStyle,
			{ minWidth: Math.max( this.props.minTabWidth, this.state.itemWidth ) },
			{ transform: [{translateX: this.animatedBar}] }
		]

		return (
			<Animated.View style={ style } />
		)
	}

	_onLayout( layout ){
		if( layout.width !== this.state.width ){
			this.setState({
				width: layout.width,
				itemWidth: layout.width / this.props.items.length 
			})
		}
	}

	getCurrentIndex( props ){
		let { items, current } = (props || this.props);
		let i = items.length;
		while( i-- > 0 ){
			if( items[i].id === current ){
				return i;
			}
		}
	}

	getCurrentBarX( props ){
		return Math.round( this.currentIndex * Math.max( props.minTabWidth, this.state.itemWidth ) )
	}

	componentDidUpdate( prevProps, prevState ){
		this.checkBarAnimation();
	}

	checkBarAnimation(){
		this.currentIndex = this.getCurrentIndex()

		if( this.currentIndex !== undefined ){
			Animated.timing( this.animatedBar, {
				toValue: this.getCurrentBarX( this.props ),
				duration: 300,
				useNativeDriver: Platform.OS !== 'web'
			}).start()

			this.startScroll()
		}
	}

	startScroll(){
		if( !this.scroll ) return;

		let containerWidth = this.state.width
		let itemWidth = Math.max( this.props.minTabWidth, this.state.itemWidth )
		let contentWidth = itemWidth * this.props.items.length;

		if( contentWidth === containerWidth ) return;

		let scrollTo = Math.round( (itemWidth * this.currentIndex) - (containerWidth/2) + (itemWidth/2) )
		if( scrollTo <= 0 ){
			this.scrollTo( 0 )
		}
		else if( scrollTo > contentWidth - containerWidth ){
			this.scrollTo( contentWidth - containerWidth )
		}
		else {
			this.scrollTo( scrollTo )
		}
	}

	scrollTo( x ){
		this.scroll.scrollTo( {x, animated: true} )
	}
}

let styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#f6f6f6',
		borderWidth: 0,
		borderColor: '#f0f0f0',
		borderTopWidth: 3
	},

	tab: {
		flex: 1,
		padding: 3
	},

	icon: {
		color: '#aaa',
		textAlign: 'center'
	},

	text: {
		color: '#aaa',
		fontSize: 12,
		textAlign: 'center'
	},

	currentBar: {
		position: 'absolute',
		top: -3, left: 0,
		height: 3,
		backgroundColor: '#1978c8'
	}
})