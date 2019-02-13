A component that allows to style onHover in react-native. This is possible to do it in RNW using special code forthe dom but with this component is possible to do it exactly with the same code for any platform.

Hoverable is not a transparent layer, you can style it by using the `style`. It accepts any property a default `View` accepts.

```js
<Hoverable hoverStyle={{backgroundColor: '#eee'}}>
	<RN.Text>Hoverable</RN.Text>
	<RN.View style={{width: 100, height: 100, backgroundColor: 'red'}}></RN.View>
</Hoverable>
```