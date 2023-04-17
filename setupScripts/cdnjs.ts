import { lib } from 'cdnjs-api';
import semverMaxSatisfying from 'semver/ranges/max-satisfying.js';
import { readFile, writeFile } from 'node:fs/promises';

export class CDNJS {
	public async download(): Promise<any> {
		return Promise.all([
			new Promise<void>((resolve, reject) => {
				this.fontAwesome.catch(reject).then((latestVersion) => {
					const fileName = `css/all${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`;
					this.writeHTML('font-awesome', latestVersion!.version, 'css', fileName, latestVersion!.sri[fileName]);
					resolve();
				});
			}),
			new Promise<void>((resolve, reject) => {
				this.jquery.catch(reject).then((latestVersion) => {
					const fileName = `jquery${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`;
					this.writeHTML('jquery', latestVersion!.version, 'js', fileName, latestVersion!.sri[fileName]);
					resolve();
				});
			}),
			new Promise<void>((resolve, reject) => {
				this.bootstrap.catch(reject).then((latestVersion) => {
					const fileName1 = `css/bootstrap${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`;
					this.writeHTML('bootstrap', latestVersion!.version, 'css', fileName1, latestVersion!.sri[fileName1]);
					const fileName2 = `js/bootstrap.bundle${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`;
					this.writeHTML('bootstrap', latestVersion!.version, 'js', fileName2, latestVersion!.sri[fileName2]);
					resolve();
				});
			}),
		]);
	}

	private get fontAwesome(): Promise<{ version: string; files: string[]; rawFiles: string[]; sri: Record<string, string> }> {
		return new Promise((resolve, reject) => {
			lib('font-awesome').then((result: { assets: { version: string; files: string[]; rawFiles: string[]; sri: Record<string, string> }[]; versions: string[] }) => {
				resolve(result.assets.find(({ version }) => version === semverMaxSatisfying(result.versions, process.env.FONTAWESOME_VERSION || ''))!);
			});
		});
	}

	private get jquery(): Promise<{ version: string; files: string[]; rawFiles: string[]; sri: Record<string, string> }> {
		return new Promise((resolve, reject) => {
			lib('jquery').then((result: { assets: { version: string; files: string[]; rawFiles: string[]; sri: Record<string, string> }[]; versions: string[] }) => {
				resolve(result.assets.find(({ version }) => version === semverMaxSatisfying(result.versions, process.env.JQUERY_VERSION || ''))!);
			});
		});
	}

	private get bootstrap(): Promise<{ version: string; files: string[]; rawFiles: string[]; sri: Record<string, string> }> {
		return new Promise((resolve, reject) => {
			lib('bootstrap').then((result: { assets: { version: string; files: string[]; rawFiles: string[]; sri: Record<string, string> }[]; versions: string[] }) => {
				resolve(result.assets.find(({ version }) => version === semverMaxSatisfying(result.versions, process.env.BOOTSTRAP_VERSION || ''))!);
			});
		});
	}

	private writeHTML(libraryName: string, version: string, libraryType: 'js' | 'css', filename: string, sri: string) {
		if (process.env.NODE_ENV === 'development') {
			console.log(`Got (https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}) as ${libraryName} ${libraryType} ${version}`);
		} else {
			console.log(`Got ${libraryName} ${libraryType} ${version}`);
		}

		const commentPatternPreload = new RegExp(`(?<=<!-- start preload ${libraryName} ${libraryType} -->(\r|\n|\r\n)\\t)[^]*(?=(\r|\n|\r\n)\\t+<!-- end preload ${libraryName} ${libraryType} -->)`, 'i');
		const commentPattern = new RegExp(`(?<=<!-- start ${libraryName} ${libraryType} -->(\r|\n|\r\n)\\t)[^]*(?=(\r|\n|\r\n)\\t+<!-- end ${libraryName} ${libraryType} -->)`, 'i');
		readFile('./public/index.html', 'utf8')
			.catch((error) => {
				console.error('File Read error');
				throw error;
			})
			.then((originalHtml) => {
				switch (libraryType) {
					case 'css':
						originalHtml = originalHtml.replace(commentPatternPreload, `<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}" integrity="${sri}" as="style" crossorigin="anonymous" referrerpolicy="no-referrer" />`);
						originalHtml = originalHtml.replace(commentPattern, `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}" integrity="${sri}" crossorigin="anonymous" referrerpolicy="no-referrer" />`);
						break;
					case 'js':
						originalHtml = originalHtml.replace(commentPatternPreload, `<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}" integrity="${sri}" as="script" crossorigin="anonymous" referrerpolicy="no-referrer" />`);
						originalHtml = originalHtml.replace(commentPattern, `<script src="https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}" integrity="${sri}" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>`);
						break;
				}
				writeFile('./public/index.html', originalHtml, 'utf8')
					.catch((error) => {
						console.error('File Write error');
						throw error;
					})
					.then(() => {
						if (process.env.NODE_ENV == 'development') {
							console.log(`Wrote ${libraryName} ${libraryType} (https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}) to html with sri (${sri})`);
						} else {
							console.log(`Wrote ${libraryName} ${libraryType} to html`);
						}
					});
			});
	}
}
