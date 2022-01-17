"use strict";

import { CryptTasks } from './cryptoMethods.js';
import { LocalStorage } from './localStorage.js';

export class Setup {
	constructor(setupComplete) {
		this.persistantStorage = new LocalStorage();
		// TODO: Check if setup completed
		if (true) {
			// Create modal dom
			this.createModalDom();
			$(() => {
				// Show modal
				new bootstrap.Modal($('div#setupModal')).show();
			});

			// Run compatibility tab stuff
			new CompatibilityTab(this.persistantStorage, () => {
				// Run security tab content
				new SecurityTab(this.persistantStorage, () => {
					// Run settings tab content
					new SettingsTab(() => {
						setupComplete();
					});
				});
			});
		}
	}

	createModalDom() {
		$(() => {
			$('body').append(`<!-- Setup Modal -->
			<div class="modal fade" id="setupModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="setupModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
					<div class="modal-content">
						<div class="modal-header bg-light">
							<h5 class="modal-title" id="setupModalLabel">Setup</h5>
							<!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
						</div>
						<div class="modal-body bg-body">
							<nav>
								<div class="nav nav-tabs justify-content-center" id="setup-nav-tab" role="tablist">
									<button class="nav-link active" id="setup-nav-compatibility-tab" data-bs-toggle="tab" data-bs-target="#setup-nav-compatibility" type="button" role="tab" aria-controls="setup-nav-compatibility" aria-selected="true"><i class="fa-solid fa-list-check"></i></button>
									<button class="nav-link disabled" id="setup-nav-security-tab" data-bs-toggle="tab" data-bs-target="#setup-nav-security" type="button" role="tab" aria-controls="setup-nav-security" aria-selected="false"><i class="fa-solid fa-user-shield"></i></button>
									<button class="nav-link disabled" id="setup-nav-settings-tab" data-bs-toggle="tab" data-bs-target="#setup-nav-settings" type="button" role="tab" aria-controls="setup-nav-settings" aria-selected="false"><i class="fa-solid fa-gear"></i></button>
								</div>
							</nav>
							<div class="tab-content" id="setup-nav-tabContent">
								<div class="tab-pane fade show active" id="setup-nav-compatibility" role="tabpanel" aria-labelledby="setup-nav-compatibility-tab"></div>
								<div class="tab-pane fade" id="setup-nav-security" role="tabpanel" aria-labelledby="setup-nav-security-tab"></div>
								<div class="tab-pane fade" id="setup-nav-settings" role="tabpanel" aria-labelledby="setup-nav-settings-tab"></div>
							</div>
						</div>
						<div class="modal-footer justify-content-start">
							<p>Use the tabs at the top to go through the setup screen</p>
						</div>
					</div>
				</div>
			</div>`);
		});
	}
}

class CompatibilityTab {
	constructor(persistantStorage, callback) {
		this.persistantStorage = persistantStorage;
		this.doneTab = callback;

		// Draw tab content
		$(() => {
			$('div.modal#setupModal div.tab-pane#setup-nav-compatibility').append(`<div class="mt-3 mb-3">
				<h6>Compatibility</h6>
			</div>
			<div class="mb-3" id="localStorage">
				Local Storage
			</div>
			<div class="mb-3">
				Web Crypto API
			</div>`);
		});
		// Check local storage compatibility
		this.localStorageCompatibility();
		// Check local encryption compatibility
		this.localEncryptionCompatibility(() => {
			// Check if both work
			if (this.localStorageAvailable && this.localEncryptionAvailable) {
				this.doneTab();
			}
		});
	}

	localStorageCompatibility() {
		const localStorageAvailable = this.localStorageAvailable = this.persistantStorage.availability;
		$(() => {
			$('div.modal#setupModal div#localStorage').append(`<span class="badge bg-${localStorageAvailable ? 'success' : 'danger'}"><i class="fa-solid fa-${localStorageAvailable ? 'check' : 'exclamation'}"></i></span>`);
		});
		if (!localStorageAvailable) {
			$(() => {
				$('div.modal#setupModal div#localStorage').append(`<div class="alert alert-danger mt-3" role="alert">
					Please make sure your browser supports <a href="https://caniuse.com/mdn-api_window_localstorage">localStorage</a> and/or has permission (some browsers use the cookies control for localStorage too)
				</div>`);
			});
		}
	}

	localEncryptionCompatibility(callback) {
		// TODO
		this.localEncryptionAvailable = true;
		this.doneTab();
	}
}

class SecurityTab {
	constructor(persistantStorage, callback) {
		this.persistantStorage = persistantStorage;
		this.doneTab = callback;

		$(() => {
			// Enable the security tab
			$('div.modal#setupModal button#setup-nav-security-tab').removeClass("disabled");
			// Jump to the security tab
			new bootstrap.Tab($('div.modal#setupModal button.nav-link#setup-nav-security-tab')).show();
			// Draw tab content
			$('div.modal#setupModal div.tab-pane#setup-nav-security').append(`<div class="mt-3 mb-3">
				<h6>Security</h6>
			</div>
			<div class="mb-3" id="">
				<b>Register</b>
				<details>
					<summary>This replaces a password with your device login</summary>
					<p>This website uses your hardware security (such as HSMs, TPMs, etc) for management of the keys used to encrypt data</p>
				</details>
			</div>
			<div class="mb-3" id="">
				<button type="button" class="btn btn-outline-primary mb-3" id="generateWebathnKeys">Generate keys</button><span id="algorithm"></span>
				<p><small>Click the button above and follow your browser or device's instructions.</small></p>
			</div>`);
			// Generate button onclick
			$('div.modal#setupModal div.tab-pane#setup-nav-security button#generateWebathnKeys').click(() => {
				this.generateWebauthnKeys();
			});;
		});
	}

	generateWebauthnKeys() {
		const webauthn = new CryptTasks(this.persistantStorage);
		webauthn.generateKeys((algorithm) => {
			$(() => {
				if (algorithm) {
					$('div.modal#setupModal div.tab-pane#setup-nav-security button#generateWebathnKeys').removeClass("btn-outline-primary");
					$('div.modal#setupModal div.tab-pane#setup-nav-security button#generateWebathnKeys').removeClass("btn-outline-danger");
					$('div.modal#setupModal div.tab-pane#setup-nav-security button#generateWebathnKeys').addClass("btn-success");
					$('div.modal#setupModal div.tab-pane#setup-nav-security button#generateWebathnKeys').prop('disabled', true);
					$('div.modal#setupModal div.tab-pane#setup-nav-security').append(`<div class="alert alert-success" role="alert">
						Generated keys using <code>${webauthn.algorithmNameForId(algorithm)}</code>
					</div>`);
				} else {
					$('div.modal#setupModal div.tab-pane#setup-nav-security button#generateWebathnKeys').removeClass("btn-outline-primary");
					$('div.modal#setupModal div.tab-pane#setup-nav-security button#generateWebathnKeys').addClass("btn-outline-danger");
					// $("div#settingsModal span#localKeysAvailable").prop("title", `Not available. Please refresh and try your authentication again`);
					console.log(`Not available. Please refresh and try your authentication again`);
				}
			});
		});
	}
}

class SettingsTab {
	constructor(callback) {
		this.doneTab = callback;

		$(() => {
			// Enable the security tab
			$('div.modal#setupModal button#setup-nav-settings-tab').removeClass("disabled");
			// Jump to the security tab
			new bootstrap.Tab($('div.modal#setupModal button.nav-link#setup-nav-settings-tab')).show();
			// Draw tab content
			$('div.modal#setupModal div.tab-pane#setup-nav-settings').append(`<div class="mt-3 mb-3">
				<h6>Settings</h6>
			</div>`);
		});
	}
}