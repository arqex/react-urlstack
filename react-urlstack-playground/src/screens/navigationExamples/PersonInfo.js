import React from 'react'
import ModalContainer from '../../components/ModalContainer';

export default function PersonInfo( props ){
	return (
		<ModalContainer router={ props.router } title="React urlstack" subtitle="A basic route stack example">
			{`
This is a **markdown** example that works well.

It also allow us to test modals inside of a path.

Fixie actually keffiyeh roof party. Raclette jean shorts craft beer, ugh pug jianbing waistcoat migas ennui. Aesthetic glossier man braid vape salvia adaptogen banh mi sriracha bicycle rights synth XOXO pok pok sartorial hoodie migas. Green juice asymmetrical taxidermy 8-bit vice. Lomo glossier kickstarter shaman.

Kitsch [gastropub](https://google.es) wolf, health goth viral cray coloring book chillwave. Bushwick echo park offal paleo, heirloom ugh banjo YOLO artisan fixie. Cornhole snackwave kitsch chicharrones pour-over literally tbh tumblr schlitz semiotics retro pop-up. Cloud bread sriracha wolf, ramps organic ethical 3 wolf moon disrupt.

Oh. You need a little dummy text for your mockup? How quaint.

## Header	

* This 
* is
* a
* list
			`}
		</ModalContainer>
	)
}