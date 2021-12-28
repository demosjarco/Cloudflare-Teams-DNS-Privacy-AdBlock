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

let pubKeyChallenge = genSecureId(8);
let userid = genSecureId(8);
let pubkeyOpt = {
	challenge: Uint8Array.from(pubKeyChallenge, c => c.charCodeAt(0)),
	rp: {
		name: "cftdpa",
		// id: "cftdpa.pages.dev"
	},
	user: {
		name: "Local User",
		displayName: "Local User",
		id: Uint8Array.from(userid, c => c.charCodeAt(0)),
	},
	// Web Crypto SubtleCrypto.encrypt() only supports RSA-OAEP, AES-CTR, AES-CBC, AES-GCM
	// AES-CTR, AES-CBC are not COSE Algorithms (https://www.iana.org/assignments/cose/cose.xhtml#algorithms)
	pubKeyCredParams: [
		// RSAES-OAEP w/ SHA-512
		{
			type: "public-key",
			alg: -42
		},
		// RSAES-OAEP w/ SHA-256
		{
			type: "public-key",
			alg: -41
		},
		// A256GCM
		{
			type: "public-key",
			alg: 3
		},
		// A192GCM
		{
			type: "public-key",
			alg: 2
		},
		// A128GCM
		{
			type: "public-key",
			alg: 1
		}
	],
	authenticatorSelection: {
		// userVerification: "required",
		authenticatorAttachment: "platform"
	},
	attestation: "indirect"
};
console.log("Key options", pubkeyOpt);
navigator.credentials.create({
	publicKey: pubkeyOpt
}).then((key) => {
	console.log(key);
}).catch((e) => {
	console.error(e);
});