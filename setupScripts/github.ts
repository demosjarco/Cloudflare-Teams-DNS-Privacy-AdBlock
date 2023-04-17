import { createWriteStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';

export class GitHub {
	public async download(): Promise<any> {
		const endFile = createWriteStream('./public/js/cbor.js');
		const hashFormat = 'sha512';
		const hash = createHash(hashFormat);

		fetch('https://raw.githubusercontent.com/paroga/cbor-js/master/cbor.js')
			.catch((error) => {
				console.error('Fetch error');
				throw error;
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Error fetching ${response.status} ${response.statusText}`);
				}

				Promise.allSettled([pipeline(response.clone().body as unknown as NodeJS.ReadableStream, endFile), pipeline(response.clone().body as unknown as NodeJS.ReadableStream, hash)]).then(() => {
					if (process.env.NODE_ENV === 'development') {
						console.log(`Downloaded ${'https://raw.githubusercontent.com/paroga/cbor-js/master/cbor.js'} to ${'./public/js/cbor.js'}`);
					} else {
						console.log('Downloaded cbor');
					}

					this.writeHTML('cbor', 'js', './js/cbor.js', `${hashFormat}-${hash.digest().toString('base64')}`);
				});
			});
	}

	private async writeHTML(libraryName: string, libraryType: 'js' | 'css', filePath: string, sri: string) {
		const commentPatternPreload = new RegExp(`(?<=<!-- start preload ${libraryName} ${libraryType} -->(\r|\n|\r\n)\\t)[^]*(?=(\r|\n|\r\n)\\t+<!-- end preload ${libraryName} ${libraryType} -->)`, 'i');
		const commentPattern = new RegExp(`(?<=<!-- start ${libraryName} ${libraryType} -->(\r|\n|\r\n)\\t)[^]*(?=(\r|\n|\r\n)\\t+<!-- end ${libraryName} ${libraryType} -->)`, 'i');
		readFile('./public/index.html', 'utf8')
			.catch((error) => {
				console.error('File Read error');
				throw error;
			})
			.then((html) => {
				switch (libraryType) {
					case 'js':
						html = html.replace(commentPatternPreload, `<link rel="preload" href="${filePath}" integrity="${sri}" as="script" />`);
						html = html.replace(commentPattern, `<script src="${filePath}" integrity="${sri}" referrerpolicy="no-referrer" defer></script>`);
						break;
				}
				writeFile('./public/index.html', html, 'utf8')
					.catch((error) => {
						console.error('File Write error');
						throw error;
					})
					.then(() => {
						if (process.env.NODE_ENV == 'development') {
							console.log(`Wrote ${libraryName} ${libraryType} (${filePath}) to html with sri (${sri})`);
						} else {
							console.log(`Wrote ${libraryName} ${libraryType} to html`);
						}
					});
			});
	}
}
