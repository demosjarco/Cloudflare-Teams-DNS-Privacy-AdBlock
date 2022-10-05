'use strict';

class GitHub {
	constructor() {
		const axios = require('axios');

		axios({
			url: 'https://raw.githubusercontent.com/paroga/cbor-js/master/cbor.js',
			method: 'get',
			responseType: 'stream',
			maxContentLength: 20000 // 20kb
		}).catch((error) => {
			throw error;
		}).then((response) => {
			const { createWriteStream } = require('fs');
			response.data.pipe(createWriteStream('./public/js/cbor.js'));
		});
	}
}

module.exports = { GitHub };