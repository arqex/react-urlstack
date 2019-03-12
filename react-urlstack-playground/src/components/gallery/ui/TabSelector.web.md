A tab selector that support overflows by moving items. Support text, icons and a fancy line that hilight the current tab.

```js
initialState = {
	tabs1: 'money',
	tabs2: 'inbox'
};

let tabItems = [
	{ id: 'inbox', label: 'Inbox', icon: 'inbox' },
	{ id: 'currencies', label: 'Currencies', icon: 'globe' },
	{ id: 'money', label: 'Checks', icon: 'credit-card' },
	{ id: 'share', label: 'Share', icon: 'share' },
	{ id: 'settings', label: 'Settings', icon: 'cog'},
];<div>

<TabSelector items={tabItems}
	current={ state.tabs1 }
	onTabPress={ item => setState({tabs1: item.id}) }
	currentTextStyle={{color: '#1978c8'}}
	currentIconStyle={{color: '#1978c8'}} />

<br /><br />

<div style={{width: 500}}>
<TabSelector items={ tabItems }
	minTabWidth={ 150 }
	current={ state.tabs2 }
	containerStyle={{borderTop: 0, borderBottomWidth: 3}}
	tabStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
	tabHoverStyle={{
		tabText: "color: #666 !important",
		tabIcon: "color: #666 !important"
	}}
	textStyle={{ fontSize: 20 }}
	currentBarStyle={{top: 'auto', bottom: -3}}
	onTabPress={ item => setState({tabs2: item.id}) }
	currentTextStyle={{color: '#1978c8'}}
	currentIconStyle={{color: '#1978c8'}}
	iconSize={18} />

</div>

</div>
```