'use strict';

class GitHub {
	constructor() {
		const axios = require('axios');
		const { createWriteStream } = require('fs');

		const endFile = createWriteStream('./public/js/cbor.js');

		axios({
			url: 'https://raw.githubusercontent.com/paroga/cbor-js/master/cbor.js',
			method: 'get',
			responseType: 'stream',
			maxContentLength: 20000 // 20kb
		}).catch((error) => {
			throw error;
		}).then((response) => {
			response.data.pipe(endFile);
		});
	}
}

module.exports = { GitHub };