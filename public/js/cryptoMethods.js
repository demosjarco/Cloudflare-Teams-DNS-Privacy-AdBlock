function genSecureId(size = 1) {
	let array = new Uint32Array(size);
	window.crypto.getRandomValues(array);
	let secureIdString = '';
	array.forEach((e) => {
		secureIdString += e.toString(36);
	});
	return secureIdString;
}

function generateKeys(callback) {
	window.crypto.subtle.generateKey({
		name: "RSA-OAEP",
		modulusLength: "4096",
		publicExponent: new Uint8Array([1, 0, 1]),
		hash: "SHA-512"
	}, false, ["encrypt", "decrypt"]).then((key) => {
		//returns a keypair object
		callback(key.privateKey, key.publicKey);
	}).catch((err1) => {
		console.error(err1);
		window.crypto.subtle.generateKey({
			name: "RSA-OAEP",
			modulusLength: "4096",
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-384"
		}, false, ["encrypt", "decrypt"]).then((key) => {
			//returns a keypair object
			callback(key.privateKey, key.publicKey);
		}).catch((err2) => {
			console.error(err2);
			window.crypto.subtle.generateKey({
				name: "RSA-OAEP",
				modulusLength: "4096",
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: "SHA-256"
			}, false, ["encrypt", "decrypt"]).then((key) => {
				//returns a keypair object
				callback(key.privateKey, key.publicKey);
			}).catch((err3) => {
				console.error(err3);
				callback(null, null);
			});
		});
	});
}