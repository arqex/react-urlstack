export default function animatedStyles( transition, indexes, layout ){
	let styles = typeof transition.styles === 'function' ? transition.styles( indexes, layout ) : transition.styles;
	if( !styles ){
		styles = {}
	}

	let animatedStyles = {}
	let transformStyles = []

	if( indexes.count ){
		animatedStyles.zIndex = indexes.count - Math.abs(indexes.relative)
	}

	Object.keys( styles ).forEach( key => {
		let value = styles[key];

		if( styleKeys[key] ){
			if( warnKeys[key] ){
				console.warn(`react-urlstack: It's possible in web, but react-native won't animate the property "${key}"`)
			}
			if( value && value.inputRange ){
				animatedStyles[ key ] = indexes.transition.interpolate( value )
			}
			else {
				animatedStyles[ key ] = value
			}
		}
		else if( transformKeys[key] ){
			// Check values
			let type = transformKeys[key];
			let warned = false;
			if( value && value.outputRange ){
				styles[key].outputRange.forEach( value =>{
					if( !warned && typeof value !== type ){
						warned = true;
						console.warn(`react-urlstack: Even if it works in web, react-native only accepts type "${transformKeys[key]}" for "${key}". Given "${ value }".`);
					}
				})

				transformStyles.push({
					[key]: indexes.transition.interpolate( value )
				})
			}
			else {
				transformStyles.push({
					[key]: value
				})
			}
		}
		else {
			console.warn(`react-urlstack: Unknown property to animate "${key}"`)
		}
	})

	if( transformStyles.length ){
		animatedStyles.transform = transformStyles
	}

	return animatedStyles
}


let styleKeys = {};
let warnKeys = {};
['left', 'right', 'top', 'bottom'].forEach( key => {
	styleKeys[key] = 1;
	warnKeys[key] = 1;
});
['width', 'height', 'opacity', 'backgroundColor', 'borderRadius'].forEach( key => {
	styleKeys[key] = 1 
})

let n = 'number', s = 'string';
let transformKeys = {
	perspective: n,
	rotate: s, rotateX: s, rotateY: s, rotateZ: s,
	scale: n, scaleX: n, scaleY: n,
	translateX: n, translateY: n,
	skeyX: s, skewY: s
};
