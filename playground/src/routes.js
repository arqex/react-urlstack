import PersonMoreInfo from './screens/PersonMoreInfo'
import PersonList from './screens/PersonList'
import PersonDetails from './screens/PersonDetails'
import Welcome from './screens/Welcome'
import Modal from './screens/Modal'
import Tabs from './screens/Tabs'

export default [
	{ path: '/tabs', cb: Tabs, children: [
		{ path: '/tab1', cb: Tab1 },
		{ path: '/tab2', cb: Tab2 },
		{ path: '/tab3', cb: Tab3, children: [
			{ path: '/:id', cb: PersonDetails, children: [
				{ path: '/modal', cb: Modal },
				{ path: '/moreInfo', cb: PersonMoreInfo },
			]}
		]}
	]},
	{ path: '/list', cb: PersonList, children: [
		{path: '/:id', cb: PersonDetails, children: [
			{path: '/moreInfo', cb: PersonMoreInfo }
		]}
	]},
	{ path: '/simpleScreen', cb: LastScreen },
	{ path: '/modal', cb: Modal },
	{ path: '*', cb: Welcome }
]
