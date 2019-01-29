import React, {Component} from 'react'
import {Animated, View, StyleSheet, Text} from 'react-native'

const Context = React.createContext('sharedElement');

// We will be storing the mounted elements by routes
let mountedElements = {}

// When a shared element is mounted it calls to this function
// and we register it
function register(instance, props ) {
	let wrapper = props.wrapper.id
	if (!mountedElements[wrapper]) {
		mountedElements[wrapper] = []
	}
	mountedElements[wrapper].push(instance);
}

// When it's unmounted we delete the references to it
function unregister(instance) {
	let wrapper = instance.props.wrapper.id
	let stack = mountedElements[ wrapper ]
	if( !stack ) return;
	
	if (stack) {
		let i = stack.length
		while (i-- > 0) {
			if (stack[i] === instance) {
				stack.splice(i, 1); 
			}
		}
	}
}

// Layers registered callback to listen to transitions
let clbks = []

// Needs to force all the shared element to measure themselves in order to get
// the rights coords to start the shared element transitions
// This is called by the ScreenStack when the transition has just been required
function reMeasure( layout ){
	let screens = Object.keys( mountedElements );
	if( screens.length < 2 ) return;

	let offset = { x: layout.x, y: layout.y };
	screens.forEach( key => {
		mountedElements[key].forEach( el => {
			el.measure( offset );
		})
	})
}

// This method is called just before starting the screen transition when the URL changes
// Screen stack is the one responsible of calling it through the context
function startTransition( prevIndexes, nextIndexes ){
	// return console.log( 'Start transition');

	let fromScreen, toScreen;
	Object.keys( prevIndexes ).forEach( id => {
		if( prevIndexes[id].relative === 0 ){
			fromScreen = {id, index: nextIndexes[id].relative};
		}
	})
	Object.keys( nextIndexes ).forEach( id => {
		if( nextIndexes[id].relative === 0 ){
			toScreen = {id, index: prevIndexes[id].relative};
		}
	})
	
	// Call the layer callback to print out the shared element transitions
	// only when we have both screens
	if( fromScreen && toScreen ){
		clbks.forEach( clbk => clbk( fromScreen, toScreen ) )
	}
}

class TransitionLayer extends Component {
	constructor( props ){
		super( props )
		this.state = {
			elements: []
		}
		this.checkForTransitions = this.checkForTransitions.bind(this);
	}

	render(){
		let layout = this.props.layout;
		let box = {
			top: layout.y || 0,
			right: (layout.x || 0) + layout.width,
			left: layout.x || 0,
			bottom: (layout.y || 0) + layout.height
		}

		if( this.state.elements.length > 0 ){
			console.log( 'couples found, rendering', this.state.elements.length )
		}
		
		return (
			<View style={ [styles.container, box] } pointerEvents="none">
				{ this.state.elements }
			</View>
		)
	}

	checkForTransitions( fromScreen, toScreen ){
		let couples = this.getTransitionCouples( fromScreen.id, toScreen.id )
		
		if( !couples.length ) return;

		this.waitForReadyAndRender( couples, toScreen.index );
	}

	waitForReadyAndRender( couples, toIndex ){
		// Check if the boxes are already calculated
		let i = couples.length;
		while( i-- > 0 ){
			if( !couples[i].leaving.box || !couples[i].entering.box ){
				// oops! retry
				return setTimeout( () => this.waitForReadyAndRender( couples, toIndex ) );
			}
		}
		
		let elements = couples.map( (couple, i) => {
			console.log( `from ${JSON.stringify(couple.leaving.box)} to ${JSON.stringify(couple.entering.box)}` )
			return this.renderElement( couple, toIndex,  `se${i}` )
		});

		this.setState({elements})
		this.setRemoveElements( elements )
	}

	setRemoveElements( elements ){
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

	renderElement( {leaving, entering}, enteringFrom, key ){
		let SharedElement = leaving.SE;

		return (
			<SharedElement key={ key }
				toIndex={ enteringFrom }
				fromBox={ leaving.box }
				toBox={ entering.box }
				fromProps={ leaving.props }
				toProps={ entering.props }
				style={ leaving.props.style }>
					{ leaving.props.children }	
			</SharedElement>
		);
	}

	cleanProps( props ){
		let clean = {};

		Object.keys( props ).forEach( p => {
			if( p !== 'se' && p !== 'wrapper' && p !== 'children' && p !== 'transitionStyles' ) {
				clean[ p ] = props[p]
			}
		});

		return clean;
	}
	
	getTransitionCouples( fromId, toId ){
		if( fromId === toId ) return [];
		
		let leaving = mountedElements[fromId]
		let entering = mountedElements[toId]
		if( !leaving || !entering ) return [];

		leaving = leaving.slice()
		entering = entering.slice()

		let couples = []

		let i = leaving.length;
		while(i-- > 0){
			// Both elements must be active
			if( !leaving[i].props.active ) continue;

			let id = leaving[i].props.sharedId;
			let j = entering.length;
			while( j-- > 0 && (entering[j].props.sharedId !== id || !entering[j].props.active) ){
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

	componentDidMount(){
		// Start listening to transitions
		clbks.push( this.checkForTransitions );
	}

	componentWillUnmount(){
		let i = clbks.length;
		while( i-- > 0 ){
			if( clbks[i] === this.checkForTransitions ){
				// Remove the callback
				clbks.splice( i , 1 );
			}
		}
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 10000
	}
})

const SharedElementWrapper = props => (
	<Context.Provider value={{ register, unregister, startTransition, reMeasure }}>
		{ props.children }
		<TransitionLayer router={ props.router } layout={ props.layout } />
	</Context.Provider>
);

export {
	Context,
	SharedElementWrapper
}