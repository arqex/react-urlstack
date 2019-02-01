let url = 'https://unpkg.com/@browser-logos/'

let transactions = [
	{ title: 'Williamsburg tbh', description: 'Asymmetrical meh hella offal disrupt coloring', price: '$1,238.00'},
	{ title: 'Quinoa lumbersexual', description: 'Drinking vinegar fashion axe crucifix live-edge', price: '$638.00'},
	{ title: 'Fingerstache forage', description: 'Enamel pin synth tacos cloud bread', price: '$1,430.95'},
	{ title: 'Cred scenester', description: 'You probably havent heard of them', price: '$830.00'},
	{ title: 'Humblebrag post', description: 'Air plant brunch taxidermy', price: '$2,138.00'},
]

export default [
	{ id: '1', name: 'Brave', img: url + 'brave/brave.png', status: 'Received', total: '$11,200.35', date: '28.07.2011', transactions },
	{ id: '2', name: 'Chromium', img: url + 'chromium/chromium.png', status: 'Not received', total: '$8,099.00', date: '08.02.2011', transactions },
	{ id: '3', name: 'Edge', img: url + 'edge/edge.png', status: 'Received', total: '$2,499.00', date: '01.02.2011', transactions },
	{ id: '4', name: 'Firefox', img: url + 'firefox/firefox.png', status: 'Error', total: '$7,150.99', date: '30.12.2010', transactions },
	{ id: '5', name: 'Opera', img: url + 'opera/opera.png', status: 'Received', total: '$18,200.35', date: '21.07.2010', transactions },
]