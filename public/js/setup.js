"use strict";
export class Setup {
	constructor() {
		// TODO: Check if setup completed
		new bootstrap.Modal($('div#setupModal')).show();

		this.compatibilityTab();
	}

	compatibilityTab() {
	}
}