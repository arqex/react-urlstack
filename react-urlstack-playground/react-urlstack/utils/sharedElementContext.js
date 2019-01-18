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
	console.log( `Mounting ${wrapper}`, mountedElements[ wrapper ] );
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

	console.log(`Unmounting ${wrapper}`, mountedElements[ wrapper ]);
}

// Layers registered callback to listen to transitions
let clbks = []

// This method is called just before starting the screen transition when the URL changes
// Screen stack is the one responsible of calling it through the context
function startTransition( prevIndexes, nextIndexes ){
	// return console.log( 'Start transition');

	let screens = {};
	Object.keys( prevIndexes ).forEach( id => {
		if( prevIndexes[id].relative === 0 ){
			screens.fromScreen = {id, index: nextIndexes[id].relative};
		}
	})
	Object.keys( nextIndexes ).forEach( id => {
		if( nextIndexes[id].relative === 0 ){
			screens.toScreen = {id, index: prevIndexes[id].relative};
		}
	})
	
	// Call the layer callback to print out the shared element transitions
	clbks.forEach( clbk => clbk(screens) )
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
		return (
			<View style={ styles.container } pointerEvents="none">
				{ this.state.elements }
			</View>
		)
	}

	checkForTransitions({fromScreen, toScreen}){
		let couples = this.getTransitionCouples( fromScreen.id, toScreen.id )
		console.log('Couples', couples)
		if( !couples.length ) return;

		let elements = couples.map( couple => (
			this.renderElement( couple, toScreen.index )
		));

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

	renderElement( {leaving, entering}, enteringFrom ){
		let SharedElement = leaving.SE;

		return (
			<SharedElement toIndex={ enteringFrom }
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
		
		let leaving = mountedElements[fromId]
		let entering = mountedElements[toId]
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
		top: 0, right: 0, left: 0, bottom: 0,
		zIndex: 10000
	}
})

const SharedElementWrapper = props => (
	<Context.Provider value={{ register, unregister, startTransition }}>
		{ props.children }
		<TransitionLayer router={ props.router } />
	</Context.Provider>
);

export {
	Context,
	SharedElementWrapper
}