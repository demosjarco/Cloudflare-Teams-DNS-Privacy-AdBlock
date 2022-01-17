"use strict";

class Storage {
	constructor(type = null) {
		this.type = type;
	}

	get availability() {
		try {
			this.storage = window[this.type];
			const x = '__storage_test__';
			this.storage.setItem(x, x);
			this.storage.removeItem(x);
			return true;
		}
		catch (e) {
			return e instanceof DOMException && (
				// everything except Firefox
				e.code === 22 ||
				// Firefox
				e.code === 1014 ||
				// test name field too, because code might not be present
				// everything except Firefox
				e.name === 'QuotaExceededError' ||
				// Firefox
				e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
				// acknowledge QuotaExceededError only if there's something already stored
				(this.storage && this.storage.length !== 0);
		}
	}

	cleanSlate() {
		this.storage.clear();
	}
}

export class LocalStorage extends Storage {
	constructor(type = 'localStorage') {
		super(type);
	}

	// const ui8a = new Uint8Array();
	// const string = btoa(ui8a);
	// const ui8a_2 = atob(string).split(',');
	savePublicKey(publicKeyBytes = new Uint8Array(272), credentialId = new Uint8Array(32)) {
		this.storage.setItem('pubKey', btoa(publicKeyBytes));
		this.storage.setItem('keyCred', btoa(credentialId));
	}
}

export class SessionStorage extends Storage {
	constructor(type = 'sessionStorage') {
		super(type);
	}
}