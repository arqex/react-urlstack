import React, {Component} from 'react'
import PropTypes from 'prop-types'
import createRouter from 'urlstack'
import { Dimensions, View, StyleSheet, Animated, Platform, StatusBar, BackHandler } from 'react-native'
import ScreenStack from './ScreenStack'
import ModalWrapper from './ModalWrapper'
import DrawerWrapper from './DrawerWrapper'
import { SharedElementWrapper } from './utils/sharedElementContext'
import TransitionDesktopDefault from './defaultTransitions/TransitionDesktopDefault'
import TransitionMobileDefault from './defaultTransitions/TransitionMobileDefault'
import TransitionModalDefault from './defaultTransitions/TransitionModalDefault'
import {memoize} from './utils/utils'

export default class Navigator extends Component {
	constructor( props ){
		super( props )

		this.state = {
			layout: this.getWindowSize()
		};

		this.getCurrentTransition = memoize( this.getCurrentTransition )
		this.getScreenStack = memoize( this.getScreenStack )
		this._onBack = this._onBack.bind( this )

		this.drawer = {
			open: () => this.drawerInstance.openDrawer(),
			close: () => this.drawerInstance.closeDrawer(),
		}

		BackHandler.addEventListener( 'hardwareBackPress', this._onBack )
	}

	static propTypes = {
		transitions: PropTypes.object
	}

	static defaultProps = {
		transitions: {
			0: TransitionMobileDefault,
			800: TransitionDesktopDefault
		}
	}

	render(){
		let router = this.router;
		if( !router ) return null;
		
		let { DrawerComponent, transitions } = this.props
		let { layout, indexes } = this.state
		
		let transition = this.getCurrentTransition( transitions, layout )
		let modalTransition = this.getModalTransitions( transition )
		let { stack, index } = this.getScreenStack( router.stack, router.activeIndex )

		return (
			<SharedElementWrapper router={router} layout={layout}>
				<View style={ styles.windowWrapper }>
					<View style={styles.container} onLayout={ e => this._onLayout( e.nativeEvent.layout ) }>
						<DrawerWrapper ref={ component => this.drawerInstance = component }
							router={router}
							transition={modalTransition.dock}
							indexes={indexes.stack}
							collapsible={ transition({}, {}).collapsibleDrawer }
							Drawer={ DrawerComponent } />
						<ScreenStack router={router}
							screenTransition={transition}
							stackTransition={modalTransition.stack}
							stackIndexes={indexes.stack}
							stack={stack}
							index={index}
							layout={layout}
							drawer={this.drawer} />
						<ModalWrapper router={router}
							stack={router.modal.stack}
							index={router.modal.stack}
							transition={modalTransition.modal}
							indexes={indexes.modal}
							layout={layout}
							drawer={this.drawer} />
					</View>
				</View>
			</SharedElementWrapper>
		)
	}

	getCurrentTransition( transitions, layout ){
		let breakPoints = Object.keys( transitions )
		let i = breakPoints.length
		
		while( i-- > 0 ){
			if( layout.width >= parseInt( breakPoints[i]) ){
				return transitions[ breakPoints[i] ]
			}
		}

		return transitions[ breakPoints[0] ]
	}

	getModalTransitions( transition ){
		let t = transition
		if( !t ){
			let { transitions } = this.props
			let { width, height } = this.state
			t = this.getCurrentTransition( transitions, width, height )
		}
		return t.modalTransition || TransitionModalDefault
	}

	// Takes the modal screens out of the stack
	getScreenStack( routerStack, routerIndex ){
		let stack = routerStack.slice();
		let index = routerIndex;
		let lastIndex = routerStack.length - 1;
		let last = stack[ lastIndex ]
		let options = last.Screen.urlstackOptions || {}

		if( options.modal ){
			stack.pop()
			if( index === lastIndex ){
				index--;
			}
		}

		return {stack, index}
	}

	startRouter( routes ){
		this.router = createRouter( routes );
		this.fu = () => this.forceUpdate();
		this.router.onChange( () => this.fu() );
		this.router.start();
		this.showingModal = this.detectModal();
		this.updateModalIndexes( this.showingModal )
	}

	getWindowSize(){
		let { width, height } = Dimensions.get('window')
		return { 
			width, height, x: 0, y: 0
		}
	}

	componentDidMount() {
		this.startRouter(this.props.routes);
	}

	componentWillUnmount() {
		this.fu = () => {}
		BackHandler.removeEventListener( 'hardwareBackPress', this._onBack )
	}

	componentDidUpdate(){
		let showModal = this.detectModal()
		if( this.showingModal !== showModal ){
			this.showingModal = showModal;
			this.updateModalIndexes( showModal );
		}
	}

	_onLayout( layout ){
		console.log( layout )
		this.setState( {layout} )
	}

	_onBack(){
		let router = this.router;
		let stack = router.stack;
		let nextRoute;
		if( router.modal.active ){
			if( router.modal.activeIndex ){
				nextRoute = router.modal.stack[ router.modal.activeIndex - 1 ].path
			}
			else {
				nextRoute = stack[ router.activeIndex ].location
				nextRoute = nextRoute.pathname + nextRoute.search
			}
		}
		else if( router.activeIndex ){
			nextRoute = stack[ router.activeIndex - 1 ].path
		}

		if( nextRoute ){
			router.navigate( nextRoute )
			return true; // Prevents getting out of the app
		}
	}

	detectModal(){
		return this.router.modal.active;
	}

	updateModalIndexes( showModal ){
		let {indexes} = this.state

		if( !indexes ){
			indexes = {
				modal: {showing: !!showModal, transition: new Animated.Value( showModal ? 1 : 0) },
				stack: {showing: !showModal, transition: new Animated.Value( showModal ? 0 : 1) }
			}
		}
		else {
			let {width, height} = this.state
			let transitions = this.getModalTransitions()
			let modalTransition = transitions.modal( indexes.modal, {width, height} )
			let stackTransition = transitions.stack( indexes.stack, {width, height} )

			indexes = {
				modal: {showing: !!showModal, transition: indexes.modal.transition },
				stack: {showing: !showModal, transition: indexes.stack.transition }
			}

			Animated.timing( indexes.modal.transition, {
				toValue: showModal ? 1 : 0,
				easing: modalTransition.easing,
				duration: modalTransition.duration || 300,
				useNativeDriver: true
			}).start()

			Animated.timing( indexes.stack.transition, {
				toValue: showModal ? 0 : 1,
				easing: stackTransition.easing,
				duration: stackTransition.duration || 300,
				useNativeDriver: true
			}).start()
		}

		this.setState({indexes})
	}
}

let statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0
if( Platform.OS === 'web' ){
	// Hack to try styles with a status bar in the web
	statusBarHeight = 20;
}

let styles = StyleSheet.create({
	windowWrapper: {
		paddingTop: statusBarHeight,
		flex: 1,
	},

	container: {
		flex: 1,
		flexDirection: 'row',
		overflow: 'hidden'
	},
})