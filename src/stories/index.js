import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import App from './TodoApp/App'
import Track from '../react-analytics';

storiesOf('Todo App', module)
  .add('with analytics', () => (
    <Track.Root onAnalyticsEvent={action('Analytics')}>
      <App/>
    </Track.Root>
  ))
  .add('without analytics', () => (
    <App/>
  ))
