'use strict';

class GitHub {
	constructor() {
		const axios = require('axios');
		const { createWriteStream } = require('node:fs');
		const { createHash } = require('node:crypto');

		const endFile = createWriteStream('./public/js/cbor.js');
		const hashFormat = 'sha512';
		const hash = createHash(hashFormat);

		axios({
			url: 'https://raw.githubusercontent.com/paroga/cbor-js/master/cbor.js',
			method: 'get',
			responseType: 'stream',
			maxContentLength: 20000, // 20kb
		}).catch((error) => {
			throw error;
		}).then((response) => {
			response.data.pipe(endFile);
			response.data.pipe(hash);
		}).finally(() => {
			endFile.once('close', () => {
				this.writeHTML('cbor', 'js', './public/js/cbor.js', `${hashFormat}-${hash.digest().toString('base64')}`);
			});
		});
	}

	writeHTML(libraryName, libraryType, filePath, sri) {
		const { readFileSync, writeFileSync } = require('node:fs');

		const commentPattern = new RegExp(`(?<=<!-- start ${libraryName} ${libraryType} -->(\r|\n|\r\n))\\t?[^]*(?=(\r|\n|\r\n)\\t+<!-- end ${libraryName} ${libraryType} -->)`, 'i');
		const originalHtml = readFileSync('./public/index.html', 'utf8');
		let replacedHTML = '';
		switch (libraryType) {
			case 'js':
				replacedHTML = originalHtml.replace(commentPattern, `\t<script src="${filePath}" integrity="${sri}" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>`);
				break;
		}
		writeFileSync('./public/index.html', replacedHTML, 'utf8');
	}
}

module.exports = { GitHub };