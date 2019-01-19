import React, {Component} from 'react'
import { StyleSheet, Animated, View } from 'react-native'
import animatedStyles from './utils/animatedStyles'
import Interactable from 'react-interactable'

let handleWidth = 30

export default class DrawerWrapper extends Component {
	constructor(props){
		super(props)
		this.drawerWidth = 300;

		this.drawerPos = new Animated.Value(0);
		this.calculateDrawerIndex();
	
		this.state = {
			open: false
		}

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

		const drawerMethods = {
			open: () => this.openDrawer(),
			close: () => this.closeDrawer()
		}
		this._drawerMethods = drawerMethods
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
		let width = this.state.open ? this.drawerWidth * 2 : this.drawerWidth + handleWidth;

		let containerStyles = [
			styles.container,
			collapsible && styles.collapsibleContainer,
			collapsible && {width, left: handleWidth - this.drawerWidth},
			this.animatedStyles
		]

		let drawerStyles = [
			styles.drawer,
			collapsible && styles.collapsibleDrawer
		]

		let snapPoints = [
			{ x: 0, id: 'closed' }, {x: this.drawerWidth - handleWidth - 10, id: 'open'}
		];

		return (
			<Animated.View style={ containerStyles }>
				{ overlay }
				<Interactable.View dragEnabled={ !!collapsible }
					ref="drawer"
					horizontalOnly={ true } snapPoints={ snapPoints }
					boundaries={{right: this.drawerWidth - handleWidth, bounce: 0}}
					onDrag={ e => this.onDrag( e ) }
					animatedValueX={ this.drawerPos }>
					<View style={ drawerStyles } onLayout={ e => this.updateLayout(e) }>
						<Drawer router={ router } drawer={ this._drawerMethods } />
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
		this.setState({open: true})
		drawer && drawer.setVelocity({x: 2000})
	}

	closeDrawer(){
		if( !this.props.collapsible || !this.open ) return;

		let drawer = this.refs.drawer
		this.setState({open: false})
		drawer && drawer.setVelocity({x: -2000})
	}

	onDrag( e ){
		if( e.nativeEvent ) e = e.nativeEvent
		
		if( e.state === 'start' ){
			this.setState({open: true})
		}
		else if( e.state === 'end' && e.targetSnapPointId === 'closed' ){
			this.setState({open: false})
		}
	}
}

let styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	collapsibleContainer: {
    position: 'absolute',
		top: 0, bottom: 0,
		zIndex: 2000,
	},
	drawer: {
    // position: 'absolute',
		top: 0, left: 0,
		height: '100%', width: '100%',
		flex: 1
	},
	collapsibleDrawer: {
    left: 0,
    width: '100%',
    flex: 1,
		position: 'relative',
		zIndex: 20000,
		paddingRight: handleWidth
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
		width: '400%',
		position: 'absolute'
	},
	expander: {
		position: 'absolute',
		height: '100%',
		top: 0, left: 0, bottom: 0
	}
})