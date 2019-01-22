import React, {Component} from 'react'
import { StyleSheet, Animated } from 'react-native'
import tabTransition from './defaultTransitions/tabTransition'
import animatedStyles from './utils/animatedStyles'
import Context from './utils/wrapperContext'
import {createId, nofn} from './utils/utils'

export default class ScreenWrapper extends Component {
	constructor(props){
		super(props)

		this.id = createId()

		this.setAnimatedLayout( props.indexes, props.layout )
	}

	static defaultProps ={
		onReady: nofn,
		onUnmount: nofn
	}

	render(){
		let item = this.props.item
		let containerStyles = [
			styles.container,
			this.animatedStyles
		]
		let contextValue = {
			transition: this.props.transition,
			indexes: this.props.indexes,
			id: item.key
		}

		return (
			<Animated.View style={ containerStyles } onLayout={ () => this.props.onReady( item.key ) }>
				<Context.Provider value={contextValue}>
					{ this.renderScreen() }
				</Context.Provider>
			</Animated.View>
		)
	}

	renderScreen(){
		let { item, ScreenStack, router, transition, indexes, layout, drawer, breakPoint } = this.props;
		let { Screen, location } = item;

		if( item.isTabs ){
			return (
				<Screen router={router}
					location={location}
					indexes={indexes}
					layout={layout}
					drawer= { drawer }
					breakPoint={ breakPoint } >
					<ScreenStack router={ router }
						screenTransition={ transition.tabTransition || tabTransition }
						stack={ item.tabs.stack }
						index={ item.tabs.activeIndex }
						breakPoint={ breakPoint } />
				</Screen>
			)
		}

		return (
			<Screen router={router}
				location={location}
				indexes={indexes}
				layout={layout}
				drawer= { drawer }
				breakPoint={ breakPoint } />
		)
	}
	
	setAnimatedLayout( indexes, layout ){
		this.animatedStyles = animatedStyles( this.props.transition, indexes, layout )
	}

	componentWillReceiveProps( nextProps ){
		if( this.hasLayoutChanged( nextProps ) ){
			this.setAnimatedLayout( nextProps.indexes, nextProps.layout );
		}
	}

	hasLayoutChanged( nextProps ){
		if( !nextProps.indexes ) return;
		
		let { width } = nextProps.layout;
		let { screen, relative } = nextProps.indexes;
		let { layout, indexes } = this.props;

		return (
			width !== layout.width ||
			screen !== indexes.screen ||
			relative !== indexes.relative ||
			this.props.transition !== nextProps.transition
		)
	}

	componentWillUnmount(){
		this.props.onUnmount( this.props.item.key )
	}
}

let styles = StyleSheet.create({
	container: {
		backgroundColor: '#eee',
		overflow: 'hidden',
		position: 'absolute',
		width: '100%', height: '100%',
		top: 0, left: 0,
		zIndex:10
	}
})