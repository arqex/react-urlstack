An flexible item for lists that allows to define left, main and right content.

Even for the main content, it's possible to define a title and a subtitle to make it even simpler to use.

```js
	<ListItem title="Title" subtitle="Subtitle" />
	<ListItem mainContent={ <RN.View><RN.Text>This is a custom main content</RN.Text></RN.View>} />
	<ListItem title="A row with right content"
		subtitle="With hover styles too"
		rightContent={ <Icon name="inbox" color="blue" size={25} /> }
		hoverStyle={{backgroundColor: '#eee'}}
		onPress={ () => alert('Clicked') } />
```