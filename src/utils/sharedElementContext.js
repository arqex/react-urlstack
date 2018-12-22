import React, {Component} from 'react'
import {Animated, View, StyleSheet} from 'react-native'

const Context = React.createContext('sharedElement');

let mountedElements = {};
function mount(instance) {
	let id = instance.props.sharedId
	if (!mountedElements[id]) {
		mountedElements[id] = []
	}
	mountedElements.push(instance);
}
function unmount(instance) {
	let id = instance.props.sharedId
	let stack = mountedElements[id]
	if (stack) {
		let i = stack.length
		while (i-- > 0) {
			if (stack[i] === instance) {
				stack.splice(i, 1);
			}
		}
	}
}

class TransitionLayer extends Component {
	render(){
		return (
			<View style={ styles.container }></View>
		)
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

const contextMethods = { mount, unmount }
const ContextProvider = Context.Provider
export {
	Context,
	contextMethods,
	ContextProvider,
	TransitionLayer
}