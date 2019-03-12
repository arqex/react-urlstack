import PersonMoreInfo from './screens/navigationExamples/PersonMoreInfo'
import PersonList from './screens/navigationExamples/PersonList'
import PersonDetails from './screens/navigationExamples/PersonDetails'
import PersonInfo from './screens/navigationExamples/PersonInfo'
import Welcome from './screens/navigationExamples/Welcome'
import Modal from './screens/navigationExamples/Modal'
import Tabs from './screens/navigationExamples/Tabs'
import Tab1 from './screens/navigationExamples/Tab1'
import Tab2 from './screens/navigationExamples/Tab2'
import Tab3 from './screens/navigationExamples/Tab3'
import SimpleScreen from './screens/navigationExamples/SimpleScreen'
import Screen404 from './screens/navigationExamples/Screen404'

import ContactList from './screens/transitionExamples/contacts/ContactList'
import ContactDetails from './screens/transitionExamples/contacts/ContactDetails'

import CheckList from './screens/transitionExamples/checks/CheckList'
import CheckDetails from './screens/transitionExamples/checks/CheckDetails'
import CheckTabs from './screens/transitionExamples/checks/CheckTabs'
import CheckEmpty from './screens/transitionExamples/checks/CheckEmpty'

export default [
	{ path: '/', cb: Welcome },
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

	{ path: '/basicStack', cb: PersonList, children: [
		{path: '/:id', cb: PersonDetails, children: [
			{path: '/moreInfo', cb: PersonMoreInfo }
		]}
	]},
	{ path: '/basicStackInfo', cb: PersonInfo, isModal: true },

	{ path: '/simpleScreen', cb: SimpleScreen },
	{ path: '/modal', cb: Modal, isModal: true },

	{ path: '/contacts', cb: ContactList, children: [
		{ path: '/:id', cb: ContactDetails }
	]},
	
	{ path: '/checks', cb: CheckTabs, isTabs: true, children: [
		{ path: '/inbox', cb: CheckEmpty },
		{ path: '/currencies', cb: CheckEmpty },
		{ path: '/money', cb: CheckList, children: [
			{ path: '/:id', cb: CheckDetails }
		]},
		{ path: '/share', cb: CheckEmpty },
		{ path: '/settings', cb: CheckEmpty },
	]},

	{ path: '/*', cb: Screen404 }
]
