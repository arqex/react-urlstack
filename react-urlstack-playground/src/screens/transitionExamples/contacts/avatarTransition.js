export default function avatarTransition({ breakPoint, entering, leaving }){
	if( breakPoint !== 0 ) return false;

	let header = entering.props.transitionState === 1 ? leaving.box : entering.box;
	let avatar = entering.props.transitionState === 2 ? leaving.box : entering.box;

	// The point where the avatar should stop before expanding
	let middlePosition = {
		x: (header.width / 2) - (avatar.width / 2),
		y: (header.height / 2) - (avatar.height / 2),
	}

	// Our coreography
	let steps = {
		moveUp: 1.3,
		expand: 1.6,
		disappear: 1.8
	}

	return {
		styles: {
			translateX: {
				inputRange: [ 1, steps.moveUp, steps.expand, steps.disappear, 2 ],
				outputRange: [ avatar.x, avatar.x, middlePosition.x, header.x, header.x]
			},
			translateY: {
				inputRange: [ 1, steps.moveUp, steps.expand, steps.disappear, 2 ],
				outputRange: [ avatar.y, avatar.y, middlePosition.y, header.y, header.y]
			},
			opacity: {
				inputRange: [ 1, steps.disappear, 1.9, 2 ],
				outputRange: [ 1, 1, 0, 0]
			},
			width: {
				inputRange: [ 1, steps.expand, steps.disappear, 2 ],
				outputRange: [ avatar.width, avatar.width, header.width, header.width]
			},
			height: {
				inputRange: [ 1, steps.expand, steps.disappear, 2 ],
				outputRange: [ avatar.height, avatar.height, header.height, header.height]
			},
			borderRadius: {
				inputRange: [ 1, steps.expand, steps.disappear, 2 ],
				outputRange: [ 50, 50, 0, 0]
			}
		},
		duration: 1000
	}
}