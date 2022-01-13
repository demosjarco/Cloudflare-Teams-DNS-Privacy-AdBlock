export function genSecureId(size = 1) {
	let array = new Uint32Array(size);
	window.crypto.getRandomValues(array);
	let secureIdString = '';
	array.forEach((e) => {
		secureIdString += e.toString(36);
	});
	return secureIdString;
}

export function algorithmNameForId(algId) {
	switch (Number(algId)) {
		case -36:
			return "ECDSA w/ SHA-512";
		case -35:
			return "ECDSA w/ SHA-384";
		case -47:
			return "ECDSA using secp256k1 curve and SHA-256";
		case -7:
			return "ECDSA w/ SHA-256";
		default:
			return Number(algId).toString();
	}
}
const webauthnalgorithms = [
	{
		name: "RSASSA-PSS w/ SHA-512",
		alg: -39
	},
	{
		name: "RSASSA-PSS w/ SHA-384",
		alg: -38
	},
	{
		name: "RSASSA-PSS w/ SHA-256",
		alg: -37
	},
	{
		name: "RSAES-OAEP w/ SHA-512",
		alg: -42
	},
	{
		name: "RSAES-OAEP w/ SHA-256",
		alg: -41
	},
	{
		name: "RSASSA-PKCS1-v1_5 using SHA-512",
		alg: -259
	},
	{
		name: "RSASSA-PKCS1-v1_5 using SHA-384",
		alg: -258
	},
	{
		name: "RSASSA-PKCS1-v1_5 using SHA-256",
		alg: -257
	},
	{
		name: "EdDSA",
		alg: -8
	}
];

export function generateKeys(callback) {
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
		pubKeyCredParams: [
			// ECDSA w/ SHA-512
			{
				type: "public-key",
				alg: -36
			},
			// ECDSA w/ SHA-384
			{
				type: "public-key",
				alg: -35
			},
			// ECDSA using secp256k1 curve and SHA-256
			{
				type: "public-key",
				alg: -47
			},
			// ECDSA w/ SHA-256
			{
				type: "public-key",
				alg: -7
			},
			// RSASSA-PSS w/ SHA-512
			{
				type: "public-key",
				alg: -39
			},
			// RSASSA-PSS w/ SHA-384
			{
				type: "public-key",
				alg: -38
			},
			// RSASSA-PSS w/ SHA-256
			{
				type: "public-key",
				alg: -37
			},
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
			// RSASSA-PKCS1-v1_5 using SHA-512
			{
				type: "public-key",
				alg: -259
			},
			// RSASSA-PKCS1-v1_5 using SHA-384
			{
				type: "public-key",
				alg: -258
			},
			// RSASSA-PKCS1-v1_5 using SHA-256
			{
				type: "public-key",
				alg: -257
			},
			// EdDSA
			{
				type: "public-key",
				alg: -8
			}
		],
		authenticatorSelection: {
			// userVerification: "required",
			authenticatorAttachment: "platform"
		},
		attestation: "indirect"
	};
	// console.log("Key options", pubkeyOpt);
	navigator.credentials.create({
		publicKey: pubkeyOpt
	}).then((credential) => {
		const utf8Decoder = new TextDecoder('utf-8');
		const decodedClientData = utf8Decoder.decode(credential.response.clientDataJSON);
		const clientDataObj = JSON.parse(decodedClientData);
		const decodedAttestationObj = CBOR.decode(credential.response.attestationObject);

		// console.log(clientDataObj);
		// console.log(decodedAttestationObj);

		const { authData } = decodedAttestationObj;

		// get the length of the credential ID
		const dataView = new DataView(new ArrayBuffer(2));
		const idLenBytes = authData.slice(53, 55);
		idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
		const credentialIdLength = dataView.getUint16();

		// get the credential ID
		const credentialId = authData.slice(55, 55 + credentialIdLength);

		// get the public key object
		const publicKeyBytes = authData.slice(55 + credentialIdLength);

		// the publicKeyBytes are encoded again as CBOR
		const publicKeyObject = CBOR.decode(publicKeyBytes.buffer);
		// console.log(publicKeyObject);
		callback(publicKeyObject["3"]);
	}).catch((err) => {
		console.error(err);
		callback(null);
	});
}

/*window.crypto.subtle.generateKey({
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
});*/