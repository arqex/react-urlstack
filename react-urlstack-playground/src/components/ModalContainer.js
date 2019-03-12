import React from 'react'
import {StyleSheet} from 'react-native';
import DynamicHeaderList from './gallery/ui/DynamicHeaderList';
import Button from './gallery/ui/Button';
import CollapsibleHeader from './CollapsibleHeader';
import Markdown from './Markdown';

export default function ModalContainer( props ){
	let closeButton = (
		<Button icon="times"
			iconSize={ 30 }
			filled={false}
			onPress={() => console.log(props.router._lastNavigated) }
			primaryColor="#fff" />
	);

	let header = (
		<CollapsibleHeader title={ props.title }
			subtitle={ props.subtitle }
			rightContent={ closeButton }
			collapsedStyle={ styles.centered }
			extendedStyle={ styles.centered }
		/>
	)

	return (
		<DynamicHeaderList header={ header }>
			<Markdown style={[styles.centered, styles.markdown]}>
				{props.children}
			</Markdown>
		</DynamicHeaderList>
	)
}


const styles = StyleSheet.create({
	centered: {
		maxWidth: 800,
		width: '100%',
		margin: 'auto',
		marginTop: 0
	},
	markdown: {
		paddingLeft: 10,
		paddingRight: 10,
	}
})