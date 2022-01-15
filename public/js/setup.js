"use strict";

import { LocalStorage } from './localStorage.js';

export class Setup {
	constructor() {
		// TODO: Check if setup completed
		new bootstrap.Modal($('div#setupModal')).show();

		this.compatibilityTab();
	}

	compatibilityTab() {
		const localStorageAvailable = new LocalStorage().availability;
		$(function () {
			$('div.modal#setupModal div#localStorage').append(`<span class="badge bg-${localStorageAvailable ? 'success' : 'danger'}"><i class="fa-solid fa-${localStorageAvailable ? 'check' : 'exclamation'}"></i></span>`);
			if (!localStorageAvailable) {
				$('div.modal#setupModal div#localStorage').append(`<div class="alert alert-danger mt-3" role="alert">
					Please make sure your browser supports <a href="https://caniuse.com/mdn-api_window_localstorage">localStorage</a> and/or has permission to do so (some browsers use the cookies control for localStorage too)
				</div>`);
			}
		});
	}
}