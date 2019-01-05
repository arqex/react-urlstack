import React, { Component } from 'react';
import { View } from 'react-native';
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
				{ this.props.children }
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

