A component that allows to style hover status for react-native-web. It actually uses css for styling hover states by adding a className and a `<style>` block to the element, so it's possible to set hover styles for inner elements or texts.

This hover behaviour is only added when running in the DOM, so we can reuse the exact component in react-native without problems, saving us creating a specific version for the web.

Hoverable is not a transparent layer, it actually creates a an element that you can style as usual using the `style` prop. Use `StyleSheet.create` with the `style` prop to make them overridable by the hoverCSS.

Since the hover behavior is usually related to clickable elements, by default the component used as a wrapper is a react-native's `Touchable` one. By default, in Android `TouchableNativeFeedback` is used, and `TouchableOpacity` otherwise. This component can be customized using the `touchable` prop. `Hoverable` pass down all the props to the wrapper component, so we can configure it as if it was a `Touchable`.

```js
let styles = RN.StyleSheet.create({
	container: { backgroundColor: 'red', height: 100, padding: 20, margin: 20 },
	square: {
		backgroundColor: 'white',
		height: 20,
		margin: 10
	}
})

let hoverStyles = {
	wrapper: `
		background: blue
	`,
	square1: `
		background: green
	`,
	square2: `
		background: yellow
	`
}

;<div>

<Hoverable style={ styles.container }
	hoverStyle={{wrapper: "background: blue; color: white"}}>
	<RN.Text>Hoverable</RN.Text>
</Hoverable>

<Hoverable style={ styles.container } hoverStyle={ hoverStyles }>
	<RN.View className="square1" style={ styles.square }></RN.View>
	<RN.View className="square2" style={ styles.square }></RN.View>
</Hoverable>

</div>
```