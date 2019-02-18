A tab selector that support overflows by moving items. Support text, icons and a fancy line that hilight the current tab.

```js
let tabItems = [
	{ id: 'inbox', label: 'Inbox', icon: 'inbox' },
	{ id: 'currencies', label: 'Currencies', icon: 'globe' },
	{ id: 'money', label: 'Checks', icon: 'credit-card' },
	{ id: 'share', label: 'Share', icon: 'share' },
	{ id: 'settings', label: 'Settings', icon: 'cog'},
];<div>

<TabSelector items={tabItems} current="money" />


</div>
```