'use strict';

import { Setup } from './setup.js';
import { Settings } from './settings.js';

new Setup(() => {
	new Settings();
});