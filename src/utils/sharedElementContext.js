import React, {Component} from 'react'
import {Animated, View, StyleSheet, Text} from 'react-native'

const Context = React.createContext('sharedElement');

// Keep track of the current route, when it changes is when transition starts
// see the TransitionLayer component
let currentRoute = false
// We will be storing the mounted elements by routes
let mountedElements = {}

// When a shared element is mounted it calls to this function
// and we register it
function mount(instance) {
	let id = instance.props.sharedId
	let wrapper = instance.props.wrapper.id
	if (!mountedElements[wrapper]) {
		mountedElements[wrapper] = []
	}
	mountedElements[wrapper].push(instance);
	console.log( `Mounting ${id}`, mountedElements[ wrapper ] );
}

// When it's unmounted we delete the references to it
function unmount(instance) {
	let stack = mountedElements[ instance.props.wrapper.id ]
	if( !stack ) return;
	
	if (stack) {
		let i = stack.length
		while (i-- > 0) {
			if (stack[i] === instance) {
				stack.splice(i, 1);
			}
		}
	}

	console.log(`Unmounting ${id}`, mountedElements[ wrapper ]);
}

class TransitionLayer extends Component {
	constructor( props ){
		super( props )
		this.state = {
			elements: []
		}
	}
	render(){
		return (
			<View style={ styles.container }>
				{ this.state.elements }
			</View>
		)
	}
	getCurrentRoute() {
		let location = this.props.router.location;
		return location.pathname + location.search;
	}
	componentDidMount(){
		currentRoute = this.getCurrentRoute()
	}
	componentDidUpdate(){
		this.checkRouteChange()
	}
	checkRouteChange(){
		let nextRoute = this.getCurrentRoute()
		if (currentRoute !== nextRoute && !this.state.transitioning) {
			this.setState({ transitioning: true }, () => {
				console.log('Updating')
				this.startTransitions(currentRoute, nextRoute);
				currentRoute = nextRoute;
				this.setState({transitioning: false})
			})
		}
	}

	startTransitions( prevRoute, nextRoute ){
		let couples = this.getTransitionCouples( prevRoute, nextRoute )
		console.log('Couples', couples)
		if( !couples.length ) return;
		let elements = this.state.elements.slice()
		couples.forEach( couple => this.startTransition( elements, couple ) )
		this.setState({elements})

		// Delete the elements from the state when the transition is over
		setTimeout( () => {
			let stateElements = this.state.elements.slice();
			let i = stateElements.length;
			let j = elements.length;
			while( i-- > 0 && j > 0 ){
				while( j-- > 0 && elements[j] !== stateElements[i] ){
					// Pass
				}
				if( j >= 0 ){
					// We have a match
					stateElements.splice( j, 1 );
				}
			}
			
			this.setState({ elements: stateElements})
		}, 500)
	}
	startTransition( elements, { leaving, entering }){
		console.log( 'Pushing element', leaving, entering );
		elements.push( <Text key={ elements.length }>Some element</Text> )
	}
	
	getTransitionCouples( prevRoute, nextRoute ){
		
		let leaving = mountedElements[prevRoute]
		let entering = mountedElements[nextRoute]
		if( !leaving || !entering ) return [];

		leaving = leaving.slice()
		entering = entering.slice()

		let couples = []

		let i = leaving.length;
		while(i-- > 0){
			let id = leaving[i].props.sharedId;
			let j = entering.length;
			while( j-- > 0 && entering[j].props.sharedId !== id ){
				// Pass
			}
			if( j >= 0 ){
				// We have a match
				couples.push({
					leaving: leaving[i],
					entering: entering[j]
				})
			}
		}
		return couples;
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
		zIndex: -10000
	},
	transitioning:{
		zIndex: 10000
	}
})

let listening = false;
function setListener( router ){
	if( listening ) return;
	listening = true;

	// Wait for the first render to start
	setTimeout( () => router.onChange( onRouteChange ), 100 )
}
function onRouteChange( location ){

}

const SharedElementWrapper = props => (
	<Context.Provider value={{ mount, unmount }}>
		{ props.children }
		<TransitionLayer router={ props.router } />
	</Context.Provider>
);

export {
	Context,
	SharedElementWrapper,
	ContextProvider
}