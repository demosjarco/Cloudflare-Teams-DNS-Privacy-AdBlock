"use strict";

import { LocalStorage } from './localStorage.js';

export class Setup {
	constructor(setupComplete) {
		// TODO: Check if setup completed
		if (true) {
			// Create modal dom
			this.createModalDom();
			$(() => {
				// Show modal
				new bootstrap.Modal($('div#setupModal')).show();
			});

			// Run compatibility tab stuff
			this.compatibilityTab();
		}

		// setupComplete();
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
								<div class="tab-pane fade" id="setup-nav-settings" role="tabpanel" aria-labelledby="setup-nav-settings-tab">
									<div class="mt-3 mb-3">
										<h6>Settings</h6>
									</div>
								</div>
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

	compatibilityTab() {
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
		this.localStorageCompatibility();
		this.localEncryptionCompatibility(() => {
			if (this.localStorageAvailable && this.localEncryptionAvailable) {
				$(() => {
					// Enable the security tab
					$('div.modal#setupModal button#setup-nav-security-tab').removeClass("disabled");
					// Jump to the security tab
					new bootstrap.Tab($('div.modal#setupModal button.nav-link#setup-nav-security-tab')).show();
					// Load security tab content
					this.securityTab();
				});
			}
		});
	}

	localStorageCompatibility() {
		const localStorageAvailable = this.localStorageAvailable = new LocalStorage().availability;
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
		callback();
	}

	securityTab() {
		$(() => {
			$('div.modal#setupModal div.tab-pane#setup-nav-security').append(`<div class="mt-3 mb-3">
				<h6>Security</h6>
			</div>`);
		});
	}
}