import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Context } from './utils/sharedElementContext';

export default class SharedElement extends Component {
	static contextType = Context;

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<View>
				<Text>Shared element</Text>
			</View>
		);
	}

	componentDidMount(){
		this.context.mount( this );
	}
	
	componentWillUnmount(){
		this.context.unmount( this );
	}
}

