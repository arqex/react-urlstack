import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ListItem from './ListItem'

storiesOf('ListItem', module)
  .add('Simple', () => (
		<ListItem key="key"
			title="title"
			subtitle="subtitle"
			onPress={ action('Pressed') } 
		/>
	))
  .add('Simple again', () => (
		<ListItem key="key"
			title="title"
			subtitle="subtitle"
			onPress={ action('Pressed') } 
		/>
	))
;
