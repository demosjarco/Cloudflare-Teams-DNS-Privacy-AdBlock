'use strict';

class GitHub {
	constructor() {
		const { createWriteStream } = require('node:fs');
		const { createHash } = require('node:crypto');
		const { pipeline } = require('node:stream/promises');

		const endFile = createWriteStream('./public/js/cbor.js');
		const hashFormat = 'sha512';
		const hash = createHash(hashFormat);

		fetch('https://raw.githubusercontent.com/paroga/cbor-js/master/cbor.js')
			.catch((error) => {
				throw error;
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}`);
				}

				// console.log(response.clone().body.constructor.name, response.clone().body.getReader().constructor.name);
				Promise.all([pipeline(response.clone().body, endFile), pipeline(response.clone().body, hash)]).then(() => {
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
