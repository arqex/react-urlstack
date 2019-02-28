import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Platform, Animated } from 'react-native';

const isIOS = Platform.OS === 'ios'

function mergeStyles( original, custom ){
	if( !custom ){
		return original;
	}
	
	if( custom.splice ){
		return [original].concat(custom)
	}

	return [original, custom]
}

export default class CollapsibleHeader extends PureComponent {

	constructor( props ){
		super( props )

		this.extendedOpacity = props.transition.interpolate({
			inputRange: [0, 0.15, 0.35, 1],
			outputRange: [0, 0, 1, 1]
		})

		this.collpasedOpacity = props.transition.interpolate({
			inputRange: [0, 0.15, 0.35, 1],
			outputRange: [1, 1, 0, 0]
		})
	}

	render(){
		let collapsed = {
			left: this.renderLeft(),
			right: this.renderRight(),
			texts: this.renderCollapsedTexts()
		}

		console.log( this.props.transition )

		return (
			<View style={ mergeStyles( [styles.container, isIOS && styles.containerIos], this.props.containerStyle) }>
				{ this.renderCollapsed( this.props, collapsed ) }
				{ this.renderExtended( this.props ) }
			</View>
		);
	}

	renderCollapsed( props, parts ){
		if( this.props.renderCollapsed ){
			return this.props.renderCollapsed( props, parts )
		}

		return (
			<View style={ mergeStyles(styles.topBar, this.props.collapsedStyle) }>
				{ parts.left }{ parts.texts }{ parts.right }
			</View>
		)
	}

	renderLeft(){
		if( this.props.leftContent ){
			return (
				<View style={ mergeStyles(styles.leftContent, this.props.leftContentStyle) }>
					{ this.props.leftContent }
				</View>
			)
		}
	}
	
	renderRight(){
		if( this.props.rightContent ){
			return (
				<View style={ mergeStyles(styles.rightContent, this.props.rightContentStyle) }>
					{ this.props.rightContent }
				</View>
			)
		}
	}

	renderCollapsedTexts(){
		let subtitle;
		let textStyle = this.props.textStyle;

		if( this.props.subtitle ){
			subtitle = (
				<Text style={ mergeStyles([styles.collapsedSubtitle, isIOS && styles.collapsedSubtitleIos, textStyle], styles.collapsedSubtitleStyle) }>
					{ this.props.collapsedSubtitle || this.props.subtitle }
				</Text>
			)
		}

		return (
			<Animated.View style={ mergeStyles([styles.collapsedTexts, {opacity: this.collpasedOpacity}], this.props.collapsedTextsStyles) }>
				<Text style={ mergeStyles([styles.collapsedTitle, isIOS && styles.collapsedTitleIos, textStyle], styles.collapsedTitleStyle) }>
					{ this.props.collapsedTitle || this.props.title }
				</Text>
				{ subtitle }
			</Animated.View>
		)
	}

	renderExtended(){
		if( this.props.renderExteded ){
			return this.props.renderExtended( this.props )
		}
		
		let subtitle;
		let textStyle = this.props.textStyle;

		if( this.props.subtitle ){
			subtitle = (
				<Text style={ mergeStyles([styles.extendedSubtitle, isIOS && styles.extendedSubtitleIos, textStyle], this.props.extendedSubtitleStyle) }>
					{ this.props.extendedSubtitle ||this.props.subtitle }
				</Text>
			)
		}

		return (
			<Animated.View style={ mergeStyles([styles.extendedContent, {opacity: this.extendedOpacity}], this.props.extendedContentStyle) }>
				<Text style={ mergeStyles([styles.extendedTitle, isIOS && styles.extendedTitleIos, textStyle], styles.extendedTitleStyle) }>
					{ this.props.extendedTitle ||this.props.title }
				</Text>
				{ subtitle }
			</Animated.View>
		)
	}
}

let styles = StyleSheet.create({
	container: {
		backgroundColor: 'purple',
		position: 'relative',
	},

	containerIos: {
		backgroundColor: 'white'
	},

	topBar:{
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative',
		zIndex: 2
	},

	extendedContent: {
		padding: 10,
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
		flex: 1,
		justifyContent: 'flex-end'
	},

	collapsedTexts: {
		flex: 1
	},

	collapsedTitle: {
		fontSize: 20,
		fontWeight: '400',
		color: 'white'
	},
	collapsedTitleIos: {
		color: '#333'
	},

	collapsedSubtitle: {
		fontSize: 16,
		fontWeight: '300',
		color: 'white'
	},

	collapsedSubtitleIos: {
		color: '#666'
	},

	
	extendedTitle: {
		fontSize: 24,
		fontWeight: '400',
		color: 'white'
	},
	extendedTitleIos: {
		color: '#333'
	},

	extendedSubtitle: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white'
	},

	extendedSubtitleIos: {
		color: '#666'
	},

	content: {},
	test: {
		color: 'white',
	},

	leftContent: {
		marginRight: 10
	},
	rightContent: {
		marginLeft: 10
	}
})