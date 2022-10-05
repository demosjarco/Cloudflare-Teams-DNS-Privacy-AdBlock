'use strict';

const cdnjsApi = require('cdnjs-api');
const semverMaxSatisfying = require('semver/ranges/max-satisfying');

class CDNJS {
	constructor() {
		this.getFontAwesome((latestVersion) => {
			const fileName = `css/all${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`;
			this.writeHTML('font-awesome', latestVersion.version, 'css', fileName, latestVersion.sri[fileName]);
		});

		this.getJquery((latestVersion) => {
			const fileName = `jquery${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`;
			this.writeHTML('jquery', latestVersion.version, 'js', fileName, latestVersion.sri[fileName]);
		});

		this.getBootstrap((latestVersion) => {
			const fileName1 = `css/bootstrap${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`;
			this.writeHTML('bootstrap', latestVersion.version, 'css', fileName1, latestVersion.sri[fileName1]);
			const fileName2 = `js/bootstrap.bundle${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`;
			this.writeHTML('bootstrap', latestVersion.version, 'js', fileName2, latestVersion.sri[fileName2]);
		})
	}

	getBootstrap(callback) {
		cdnjsApi.lib('bootstrap').then(result => {
			callback(result.assets.find(({ version }) => version === semverMaxSatisfying(result.versions, process.env.BOOTSTRAP_VERSION || '')));
		});
	}

	getFontAwesome(callback) {
		cdnjsApi.lib('font-awesome').then(result => {
			callback(result.assets.find(({ version }) => version === semverMaxSatisfying(result.versions, process.env.FONTAWESOME_VERSION || '')));
		});
	}

	getJquery(callback) {
		cdnjsApi.lib('jquery').then(result => {
			callback(result.assets.find(({ version }) => version === semverMaxSatisfying(result.versions, process.env.JQUERY_VERSION || '')));
		});
	}

	writeHTML(libraryName, version, libraryType, filename, sri) {
		if (process.env.NODE_ENV === 'development') {
			console.log(`Got (https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}) as ${libraryName} ${libraryType} ${version}`);
		} else {
			console.log(`Got Got ${libraryName} ${libraryType} ${version}`);
		}
		
		const { readFileSync, writeFileSync } = require('fs');

		const commentPatternPreload = new RegExp(`(?<=<!-- start preload ${libraryName} ${libraryType} -->(\r|\n|\r\n))\\t?[^]*(?=(\r|\n|\r\n)\\t+<!-- end preload ${libraryName} ${libraryType} -->)`, 'i');
		const commentPattern = new RegExp(`(?<=<!-- start ${libraryName} ${libraryType} -->(\r|\n|\r\n))\\t?[^]*(?=(\r|\n|\r\n)\\t+<!-- end ${libraryName} ${libraryType} -->)`, 'i');
		const originalHtml = readFileSync('./public/index.html', 'utf8');
		let replacedHTML = '';
		switch (libraryType) {
			case 'css':
				replacedHTML = originalHtml.replace(commentPatternPreload, `\t<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}" as="style" crossorigin />`);
				replacedHTML = originalHtml.replace(commentPattern, `\t<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}" integrity="${sri}" crossorigin="anonymous" referrerpolicy="no-referrer" />`);
				break;
			case 'js':
				replacedHTML = originalHtml.replace(commentPatternPreload, `\t<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}" as="script" crossorigin />`);
				replacedHTML = originalHtml.replace(commentPattern, `\t<script src="https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}" integrity="${sri}" crossorigin="anonymous" referrerpolicy="no-referrer" defer></script>`);
				break;
		}
		writeFileSync('./public/index.html', replacedHTML, 'utf8');

		if (process.env.NODE_ENV == 'development') {
			console.log(`Wrote ${libraryName} ${libraryType} (https://cdnjs.cloudflare.com/ajax/libs/${libraryName}/${version}/${filename}) to html with sri (${sri})`);
		} else {
			console.log(`Wrote ${libraryName} ${libraryType} to html`);
		}
	}
}

module.exports = { CDNJS };