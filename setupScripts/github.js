'use strict';

class GitHub {
	constructor() {
		const axios = require('axios').default;
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
				if (process.env.NODE_ENV === 'development') {
					console.log(`Downloaded ${'https://raw.githubusercontent.com/paroga/cbor-js/master/cbor.js'} to ${'./public/js/cbor.js'}`);
				} else {
					console.log('Downloaded cbor')
				}
				
				this.writeHTML('cbor', 'js', './public/js/cbor.js', `${hashFormat}-${hash.digest().toString('base64')}`);
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
				replacedHTML = replacedHTML.replace(commentPatternPreload, `<link rel="preload" href="${filePath}" as="script" />`);
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