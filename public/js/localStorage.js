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

	get publicKeyBytes() {
		// Convert from base64 to array
		const bufferArray = atob(this.storage.getItem('pubKey')).split(',');
		// Convert string values to number values
		const numberedArray = bufferArray.map((x) => { return Number(x, 10); });
		// Convert from regular array to Uint8Array
		return Uint8Array.from(numberedArray);
	}

	get credentialId() {
		// Convert from base64 to array
		const bufferArray = atob(this.storage.getItem('keyCred')).split(',');
		// Convert string values to number values
		const numberedArray = bufferArray.map((x) => { return Number(x, 10); });
		// Convert from regular array to Uint8Array
		return Uint8Array.from(numberedArray);
	}

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