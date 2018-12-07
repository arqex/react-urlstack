import React, {Component} from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import animatedStyles from './utils/animatedStyles'
import Interactable from 'react-interactable'

export default class DrawerWrapper extends Component {
	constructor(props){
		super(props)
		this.drawerWidth = 300;

		this.drawerPos = new Animated.Value(0);
		this.calculateDrawerIndex();
		this.open = false;

		this.overlayAnimStyle = {
			transform: [{translateX: this.drawerIndex.interpolate({
				inputRange: [0, 0.01, 1],
				outputRange: [ -10000, 0, 0]
			})}],
			opacity: this.drawerIndex.interpolate({
				inputRange: [0,0,1,1],
				outputRange: [0,0,.5,.5]
			})
		}
	}

	render(){
		let { Drawer, router, collapsible } = this.props
		let handle, overlay
		if( collapsible ){
			handle = <View style={ styles.handle } />
			overlay = (
			<Animated.View style={ [styles.overlay, this.overlayAnimStyle] }
				onClick={ () => this.closeDrawer() }>
			</Animated.View>
			)
		}
		let containerStyles = [
			styles.container,
			collapsible && styles.collapsibleContainer,
			this.animatedStyles
		]

		let drawerStyles = [
			styles.drawer,
			collapsible && styles.collapsibleDrawer
		]

		let snapPoints = [
			{ x: 0, id: 'closed' }, {x: this.drawerWidth, id: 'open'}
		];

		return (
			<Animated.View style={ containerStyles }>
				{ overlay }
				<Interactable.View dragEnabled={ collapsible }
					ref="drawer"
					horizontalOnly={ true } snapPoints={ snapPoints }
					boundaries={{right: this.drawerWidth, bounce: 0.5}}
					onSnapStart={ e => this.onSnap( e ) }
					animatedValueX={ this.drawerPos }>
					<View style={ drawerStyles } onLayout={ e => this.updateLayout(e) }>
						<Drawer router={ router } />
						{ handle }
					</View>
				</Interactable.View>
			</Animated.View>
		)
	}
	
	updateLayout( e ){
		let {layout} = e.nativeEvent;

		this.animatedStyles = animatedStyles(this.props.transition, this.props.indexes, layout );
		this.drawerWidth = layout.width;
		this.calculateDrawerIndex();
		this.forceUpdate();
	}

	componentDidUpdate( prevProps ){
		if( prevProps.collapsible && !this.props.collapsible ){
			this.drawerPos.setValue(0);
			console.log('Resetting position')
			this.forceUpdate()
		}
	}

	calculateDrawerIndex(){
		let di = this.drawerIndex;
		let index = this.drawerPos.interpolate({
			inputRange: [0, this.drawerWidth ],
			outputRange: [0, 1]
		})

		if( di ){
			di._config = index._config;
			di._interpolation = index._interpolation;
		}
		else {
			this.drawerIndex = index;
		}
	}

	openDrawer(){
		if( !this.props.collapsible || this.open ) return;

		let drawer = this.refs.drawer
		drawer && drawer.setVelocity({x: 2000})
	}

	closeDrawer(){
		if( !this.props.collapsible || !this.open ) return;

		let drawer = this.refs.drawer
		drawer && drawer.setVelocity({x: -2000})
	}

	onSnap( e ){
		if( e.nativeEvent ) e = e.nativeEvent
		this.open = e.id === 'open';
	}
}

let styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	collapsibleContainer: {
    position: 'absolute',
		top: 0, bottom: 0, left: '-100%',
		width: '100%',
    flexDirection: 'row-reverse',
		zIndex: 2000,
		backgroundColor: '#e0e0e0',
	},
	drawer: {
    // position: 'absolute',
		top: 0, left: 0,
		height: '100%', width: '100%',
		flex: 1,
		zIndex: 20000
	},
	collapsibleDrawer: {
    left: 0,
    width: '100%',
    flex: 1,
		backgroundColor: '#e0e0e0',
		position: 'relative',
		zIndex: 20000
	},
	handle: {
		width: 40,
		top: 0, bottom: 0, right: -20,
		// backgroundColor: 'green',
		position: 'absolute',
		zIndex: 10
	},
	overlay: {
		backgroundColor: 'black',
		height: '100%',
		width: '100%',
		position: 'absolute',
		left: '100%'
	},
	expander: {
		position: 'absolute',
		height: '100%',
		top: 0, left: 0, bottom: 0
	}
})