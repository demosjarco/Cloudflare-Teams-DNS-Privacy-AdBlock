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
			url: '/paroga/cbor-js/master/cbor.js',
			method: 'get',
			baseURL: 'https://raw.githubusercontent.com',
			responseType: 'stream',
			maxContentLength: 20000, // 20kb
		}).catch((error) => {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.error(error.response.data);
				console.error(error.response.status);
				console.error(error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.error(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error('Error', error.message);
			}
			throw error.config;
		}).then((response) => {
			response.data.pipe(endFile);
			response.data.pipe(hash);
		}).finally(() => {
			endFile.once('close', () => {
				if (process.env.NODE_ENV === 'development') {
					console.log(`Downloaded ${'https://raw.githubusercontent.com/paroga/cbor-js/master/cbor.js'} to ${'./public/js/cbor.js'}`);
				} else {
					console.log('Downloaded cbor');
				}
				
				this.writeHTML('cbor', 'js', './js/cbor.js', `${hashFormat}-${hash.digest().toString('base64')}`);
			});
		});
	}

	writeHTML(libraryName, libraryType, filePath, sri) {
		const { readFileSync, writeFileSync } = require('node:fs');

		const commentPatternPreload = new RegExp(`(?<=<!-- start preload ${libraryName} ${libraryType} -->(\r|\n|\r\n)\\t)[^]*(?=(\r|\n|\r\n)\\t+<!-- end preload ${libraryName} ${libraryType} -->)`, 'i');
		const commentPattern = new RegExp(`(?<=<!-- start ${libraryName} ${libraryType} -->(\r|\n|\r\n)\\t)[^]*(?=(\r|\n|\r\n)\\t+<!-- end ${libraryName} ${libraryType} -->)`, 'i');
		const originalHtml = readFileSync('./public/index.html', 'utf8');
		let replacedHTML = originalHtml;
		switch (libraryType) {
			case 'js':
				replacedHTML = replacedHTML.replace(commentPatternPreload, `<link rel="preload" href="${filePath}" integrity="${sri}" as="script" />`);
				replacedHTML = replacedHTML.replace(commentPattern, `<script src="${filePath}" integrity="${sri}" referrerpolicy="no-referrer" defer></script>`);
				break;
		}
		writeFileSync('./public/index.html', replacedHTML, 'utf8');

		if (process.env.NODE_ENV == 'development') {
			console.log(`Wrote ${libraryName} ${libraryType} (${filePath}) to html with sri (${sri})`);
		} else {
			console.log(`Wrote ${libraryName} ${libraryType} to html`);
		}
	}
}

module.exports = { GitHub };