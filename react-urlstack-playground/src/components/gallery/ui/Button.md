A button hoverable component that accepts icons.

```js
<Button onPress={ () => alert('Hola')}>Hola</Button><br />
<Button icon="thumbs-up" onPress={ () => alert('Hola')}>Hola</Button><br />
<Button icon="warning" filled={ false } onPress={ () => alert('Transparent')}>Transparent</Button><br />

<div style={{display: 'flex'}}>
	<Button style={{width: 40}} icon="heart" />
	<Button filled={ false } primaryColor="pink" style={{width: 40}} icon="heart" />
</div>
```
