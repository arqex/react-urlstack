import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Platform } from 'react-native';

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
	render(){
		let collapsed = {
			left: this.renderLeft(),
			right: this.renderRight(),
			texts: this.renderCollapsedTexts()
		}

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
				{ parts.left }{ parts.texts }{ parts.rigth }
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
		if( this.props.subtitle ){
			subtitle = (
				<Text style={ mergeStyles([styles.collapsedSubtitle, isIOS && styles.collapsedSubtitleIos], styles.collapsedSubtitleStyle) }>
					{ this.props.collapsedSubtitle || this.props.subtitle }
				</Text>
			)
		}

		return (
			<View style={ mergeStyles(styles.collapsedTexts, this.props.collapsedTextsStyles) }>
				<Text style={ mergeStyles([styles.collapsedTitle, isIOS && styles.collapsedTitleIos], styles.collapsedTitleStyle) }>
					{ this.props.collapsedTitle || this.props.title }
				</Text>
				{ subtitle }
			</View>
		)
	}

	renderExtended(){
		if( this.props.renderExteded ){
			return this.props.renderExtended( this.props )
		}
		
		let subtitle;
		if( this.props.subtitle ){
			subtitle = (
				<Text style={ mergeStyles([styles.extendedSubtitle, isIOS && styles.extendedSubtitleIos], this.props.extendedSubtitleStyle) }>
					{ this.props.extendedSubtitle ||this.props.subtitle }
				</Text>
			)
		}

		return (
			<View style={ mergeStyles(styles.extendedContent, this.props.extendedContentStyle) }>
				<Text style={ mergeStyles([styles.extendedTitle, isIOS && styles.extendedTitleIos], styles.extendedTitleStyle) }>
					{ this.props.extendedTitle ||this.props.title }
				</Text>
				{ subtitle }
			</View>
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
		padding: 10
	},

	extendedContent: {
		padding: 10,
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
		flex: 1,
		justifyContent: 'flex-end'
	},

	collapsedTitle: {
		fontSize: 20,
		fontWeight: 400,
		color: 'white'
	},
	collapsedTitleIos: {
		color: '#333'
	},

	collapsedSubtitle: {
		fontSize: 16,
		fontWeight: 300,
		color: 'white'
	},

	collapsedSubtitleIos: {
		color: '#666'
	},

	
	extendedTitle: {
		fontSize: 24,
		fontWeight: 400,
		color: 'white'
	},
	extendedTitleIos: {
		color: '#333'
	},

	extendedSubtitle: {
		fontSize: 18,
		fontWeight: 300,
		color: 'white'
	},

	extendedSubtitleIos: {
		color: '#666'
	},

	content: {},
	test: {
		color: 'white',
	}
})