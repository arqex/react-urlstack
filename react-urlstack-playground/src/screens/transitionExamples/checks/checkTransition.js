export default function checkTransition({ breakPoint, entering, leaving }){
	if( breakPoint !== 0 ) return false;

	let isForward = entering.props.transitionState === 2;
	let startY = isForward ? leaving.box.y : entering.box.y;
	let endY = isForward ? entering.box.y : leaving.box.y;
	let offset = startY > endY ? 20 : -20

	return {
		styles: {
			translateY: {
				inputRange: [ 1, 1.1, 1.25, 1.75, 1.9, 2 ],
				outputRange: [ startY, startY, startY + offset, endY - offset, endY, endY ] 
			}
		}
	}
}