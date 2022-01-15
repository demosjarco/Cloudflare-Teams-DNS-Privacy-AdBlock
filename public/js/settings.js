"use strict";

// import { generateKeys, algorithmNameForId } from './cryptoMethods.js';

export class Settings {
	constructor() {
		this.createButton();
		this.createModalDom();
	}

	createButton() {
		$(() => {
			$('body > nav').append(`<button type="button" class="btn btn-secondary justify-content-end" data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</button>`);
		});
	}

	createModalDom() {
		$(() => {
			$('body').append(`<!-- Settings Modal -->
			<div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
					<div class="modal-content">
						<div class="modal-header bg-light">
							<h5 class="modal-title" id="settingsModalLabel">Settings</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="modal-body bg-body">
							<!-- <div class="mb-3">
								<p></p>
							</div> -->
							<nav>
								<div class="nav nav-tabs nav-fill" id="settings-nav-tab" role="tablist">
									<button type="button" class="btn btn-outline-success" id="addAccount"><i class="fa-solid fa-plus"></i></button>
								</div>
							</nav>
							<div class="tab-content" id="settings-nav-tabContent"></div>
						</div>
						<div class="modal-footer justify-content-start">
							<p>Enter your Cloudflare Account ID(s) and <a href="https://dash.cloudflare.com/profile/api-tokens">API Key(s)</a> for this tool to communicate with the Cloudflare API in order to perform the <a href="">tasks</a> in this tool. No data is sent anywhere other than the <a href="https://api.cloudflare.com/#getting-started-requests">Cloudflare API</a> itself.</p>
							<p>All data is stored locally using your browser's <span id="localStorageAvailable" class="badge rounded-pill bg-primary" data-bs-toggle="tooltip">Local Storage</span>, encrypted with <span id="localCryptoAvailable" class="badge rounded-pill bg-primary" data-bs-toggle="tooltip">Web Crypto API</span>, and signed with <span id="localKeysAvailable" class="badge rounded-pill bg-primary" data-bs-toggle="tooltip">WebAuthn</span>.</p>
						</div>
					</div>
				</div>
			</div>`);
		});

		this.setupModalInteration();
	}

	setupModalInteration() {
		$(() => {
			// Add new account
			$("div#settingsModal button#addAccount").click((event) => {
				$(function () {
					if ($('div#settingsModal div#account-id').length) {
						// New account already added
					} else {
						// Create new account tab
						$(`<button class="nav-link active" id="account-id-tab" data-bs-toggle="pill" data-bs-target="#account-id" type="button" role="tab" aria-controls="account-id" aria-selected="true" title="Account ID#">Account Name</button>`).insertBefore("div#settingsModal button#addAccount");

						const newForm = $(`<div class="tab-pane fade show active" id="account-id" role="tabpanel" aria-labelledby="account-id-tab">
				<form onsubmit="return false;">
					<div class="form-group mb-3">
						<label for="account-id-id" class="col-form-label">Account ID:</label>
						<input type="text" class="form-control" id="account-id-id" spellcheck="false" autocapitalize="off" autocomplete="off" pattern="\\w+" minlength="32" maxlength="32" aria-required="true" required />
					</div>
					<div class="form-group mb-3">
						<label for="account-id-key" class="col-form-label">API Key:</label>
						<input type="password" class="form-control" id="account-id-key" spellcheck="false" autocapitalize="off" autocomplete="off" pattern="[\\w-]+" minlength="40" maxlength="40" aria-required="true" required />
					</div>
					<div class="d-grid gap-2 d-md-flex justify-content-end">
						<input class="btn btn-outline-danger" type="reset">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
						<input class="btn btn-primary" type="submit" value="Save">
					</div>
				</form>
			</div>`).appendTo('div#settingsModal div#settings-nav-tabContent');
						newForm.find("form").submit((event) => {
							formSave(event);
						});

						$('div#settingsModal div#account-id').tab('show');
					}
				});
			});

			// Intercept form save for custom save
			$("div#settingsModal form").submit((event) => {
				// formSave(event);
			});
		});
	}

	refreshTooltips() {
		$(() => {
			const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
			tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new bootstrap.Tooltip(tooltipTriggerEl);
			});
		});
	}
}

/*
// Check for local storage availability
if (storageAvailable('localStorage')) {
	$(function () {
		$("div#settingsModal span#localStorageAvailable").removeClass("bg-primary");
		$("div#settingsModal span#localStorageAvailable").addClass("bg-success");
		$("div#settingsModal span#localStorageAvailable").prop("title", `Local Storage available`);
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl);
		});
	});
}
else {
	$(function () {
		$("div#settingsModal span#localStorageAvailable").removeClass("bg-primary");
		$("div#settingsModal span#localStorageAvailable").addClass("bg-danger");
		$("div#settingsModal span#localStorageAvailable").prop("title", `Local Storage not available. Check that cookies are enabled.`);
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl);
		});
	});
}

// Check for local crypto availability
encryptedStorageAvailable((available, algorithm) => {
	$(function () {
		if (available) {
			$("div#settingsModal span#localCryptoAvailable").removeClass("bg-primary");
			$("div#settingsModal span#localCryptoAvailable").addClass("bg-success");
			$("div#settingsModal span#localCryptoAvailable").prop("title", `Using ${algorithm.name} with ${algorithm.modulusLength} bits and ${algorithm.hash.name}`);
		} else {
			$("div#settingsModal span#localCryptoAvailable").removeClass("bg-primary");
			$("div#settingsModal span#localCryptoAvailable").addClass("bg-danger");
			$("div#settingsModal span#localCryptoAvailable").prop("title", `Not available`);
		}
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl);
		});
	});
});

webauthnAvailable();

function storageAvailable(type) {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
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
			(storage && storage.length !== 0);
	}
}

function encryptedStorageAvailable(testResult) {
	// generateKeys((privateKey, publicKey) => {
	// 	if (privateKey && publicKey) {
	// 		testResult(true, privateKey.algorithm);
	// 	} else {
	// 		testResult(false);
	// 	}
	// });
}

function webauthnAvailable(testResult) {
	generateKeys((algorithm) => {
		$(function () {
			if (algorithm) {
				$("div#settingsModal span#localKeysAvailable").removeClass("bg-primary");
				$("div#settingsModal span#localKeysAvailable").addClass("bg-success");
				$("div#settingsModal span#localKeysAvailable").prop("title", algorithmNameForId(algorithm));
			} else {
				$("div#settingsModal span#localKeysAvailable").removeClass("bg-primary");
				$("div#settingsModal span#localKeysAvailable").addClass("bg-danger");
				$("div#settingsModal span#localKeysAvailable").prop("title", `Not available. Please refresh and try your authentication again`);
			}
			tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new bootstrap.Tooltip(tooltipTriggerEl);
			});
		});
	});
}*/