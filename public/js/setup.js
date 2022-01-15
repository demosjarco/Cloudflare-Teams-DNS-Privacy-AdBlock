"use strict";

import { LocalStorage } from './localStorage.js';

export class Setup {
	constructor() {
		// TODO: Check if setup completed
		new bootstrap.Modal($('div#setupModal')).show();

		this.compatibilityTab();
	}

	compatibilityTab() {
		if (new LocalStorage().availability) {
			$(function () {
			});
		} else {
			$(function () {
			});
		}
	}
}