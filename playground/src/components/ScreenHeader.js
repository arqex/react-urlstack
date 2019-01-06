import React from 'react'
import {SharedComponent} from 'react-urlstack';

export default class ScreenHeader extends SharedComponent {
	render( prevProps, nextProps ){
		return (
			<View>

			</View>
		)
	}
}

<Header title="One" subtitle="my one" />
<Header title="One" subtitle="my one" />

let transition = ({fromIndex, toIndex, animatedValue, fromProps, toProps, fromBox, toBox, interpolator, boxInterpolator}) => {
	return boxInterpolator()
}
<SharedElement id="header" transitionStyle={ transition }>
	<Animated.View>
		<Text>Title</Text>
		<Text>Subtitle</Text>
	</Animated.View>
</SharedElement>