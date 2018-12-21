import PersonMoreInfo from './screens/PersonMoreInfo'
import PersonList from './screens/PersonList'
import PersonDetails from './screens/PersonDetails'
import Welcome from './screens/Welcome'
import Modal from './screens/Modal'
import Tabs from './screens/Tabs'
import Tab1 from './screens/Tab1'
import Tab2 from './screens/Tab2'
import Tab3 from './screens/Tab3'
import SimpleScreen from './screens/SimpleScreen'

export default [
	{ path: '/tabs', cb: Tabs, isTabs: true, children: [
		{ path: '/tab1', cb: Tab1 },
		{ path: '/tab2', cb: Tab2 },
		{ path: '/tab3', cb: Tab3, children: [
			{ path: '/:id', cb: PersonDetails, children: [
				{ path: '/modal', cb: Modal, isModal: true },
				{ path: '/moreInfo', cb: PersonMoreInfo },
			]}
		]}
	]},
	{ path: '/list', cb: PersonList, children: [
		{path: '/:id', cb: PersonDetails, children: [
			{path: '/moreInfo', cb: PersonMoreInfo }
		]}
	]},
	{ path: '/simpleScreen', cb: SimpleScreen },
	{ path: '/modal', cb: Modal, isModal: true },
	{ path: '/*', cb: Welcome }
]
