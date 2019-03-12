import React from 'react'
import MD from 'react-native-easy-markdown'


export default function Markdown( props ){
	return (
		<MD style={ props.style }
			useDefaultStyles
			markdownStyles={ mdStyles }>
			{ props.children }
		</MD>
	)
}

const mdStyles = {
	text: {
		fontSize: 18,
		lineHeight: 24
	},

	h2: {
		fontSize: 24,
		marginTop: 20,
		marginBottom: 8
	}
}