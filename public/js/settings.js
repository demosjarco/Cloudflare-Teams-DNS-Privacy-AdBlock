$(function () {
	$("div#settingsModal form").submit((event) => {
		console.log(event);
	});
	$("div#settingsModal button#addAccount").click((event) => {
		if ($('div#settingsModal div#account-id').length) {
			// New account already added
		} else {
			// Create new account tab
			$(`<button class="nav-link active" id="account-id-tab" data-bs-toggle="pill" data-bs-target="#account-id" type="button" role="tab" aria-controls="account-id" aria-selected="true" title="Account ID#">Account Name</button>`).insertBefore("div#settingsModal button#addAccount");

			$(`<div class="tab-pane fade show active" id="account-id" role="tabpanel" aria-labelledby="account-id-tab">
				<div class="mb-3">
					<label for="account-id-id" class="col-form-label">Account ID:</label>
					<input type="text" class="form-control" id="account-id-id" spellcheck="false" autocomplete="off" pattern="[\w\d]+" minlength="32" maxlength="32" aria-required="true" required />
				</div>
				<div class="mb-3">
					<label for="account-id-key" class="col-form-label">API Key:</label>
					<input type="password" class="form-control" id="account-id-key" spellcheck="false" autocomplete="off" pattern="[\w\d-_]/i" minlength="40" maxlength="40" aria-required="true" required />
				</div>
			</div>`).appendTo('div#settingsModal div#settings-nav-tabContent');

			$('div#settingsModal div#account-id').tab('show');
		}
	});
});