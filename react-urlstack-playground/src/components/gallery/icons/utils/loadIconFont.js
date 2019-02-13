
import {Platform} from 'react-native';
const isWeb = Platform.OS === 'web';

export default function loadIconFont( name, iconFont ){
	if( !isWeb ) return;
	
	const iconFontStyles = `@font-face {
		src: url(${iconFont});
		font-family: ${name};
	}`;
	
	// Create stylesheet
	const style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet) {
		style.styleSheet.cssText = iconFontStyles;
	} else {
		style.appendChild(document.createTextNode(iconFontStyles));
	}
	
	// Inject stylesheet
	document.head.appendChild(style);
}