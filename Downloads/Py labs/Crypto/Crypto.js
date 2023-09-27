function getMessageToEncode() {
	let message= "This is the message";
	let encoder = new TextEncoder();
	return encoder.encode(message);
}

async function createKey() {
	let finalKey = await window.crypto.subtle.generateKey(
	{
          name: "AES-GCM",
          length: 256,
    	},
    	true,
    	["encrypt", "decrypt"],
	);
	console.log("created key: ", finalKey);//
	return finalKey;
}


//encrypt our ciphertext and return it
async function createCipherText(key) {
	let encoded = getMessageToEncode();
	let cipherText = await window.crypto.subtle.encrypt(
	  {
		name: "AES-GCM",
		iv: iv
	  },
	  key,
	  encoded
	);
	console.log("CipherText encoded: ", Promise.resolve(cipherText));//
	return cipherText;
}

async function findKeyOfSize2(key, cipherText, iv) {
	const exportedKey = await window.crypto.subtle.exportKey("raw", key);       
    let guessBuffer = new Uint32Array(exportedKey);
	
	const mask = 0b11;

    guessBuffer[0] &= ~mask;
	let decrypted;
	let original = guessBuffer[0];
	let converted;
    
	for (let i = 0; i < 4; ++i) {
		guessBuffer[0] = original + i;
		converted = guessBuffer.buffer;
				console.log(guessBuffer);

	try {
		let importedKey = await window.crypto.subtle.importKey("raw", converted,"AES-GCM", true, ["encrypt","decrypt"]);
    		console.log("Trying new key: ", importedKey);

		let decrypted = await window.crypto.subtle.decrypt(
			{
                        name: "AES-GCM",
                        iv: iv
                    	},
	  		importedKey,
			cipher
		);

		console.log("Encryption suceeded! key was: ", decrypted);
		break;
	}
	catch (e){
		console.log("Decryption failed: ", e);
	}
	}
}


async function findKeyOfSize4(key, cipherText, iv) {
	const exportedKey = await window.crypto.subtle.exportKey("raw", key);       
    let guessBuffer = new Uint32Array(exportedKey);
	
	const mask = 0b1111;

    guessBuffer[0] &= ~mask;
	let decrypted;
	let original = guessBuffer[0];
	let converted;
    
	for (let i = 0; i < 16; ++i) {
		guessBuffer[0] = original + i;
		converted = guessBuffer.buffer;
				console.log(guessBuffer);

	try {
		let importedKey = await window.crypto.subtle.importKey("raw", converted,"AES-GCM", true, ["encrypt","decrypt"]);
    		console.log("Trying new key: ", importedKey);

		let decrypted = await window.crypto.subtle.decrypt(
			{
                        name: "AES-GCM",
                        iv: iv
                    	},
	  		importedKey,
			cipher
		);

		console.log("Encryption suceeded! key was: ", decrypted);
		break;
	}
	catch (e){
		console.log("Decryption failed: ", e);
	}
	}
}





let iv = window.crypto.getRandomValues(new Uint8Array(12));
const key = await createKey();``
const cipher = await createCipherText(key);
console.log(key);


//findKeyOfSize2(key, cipher, iv);
//findKeyOfSize4(key, cipher, iv);
async function findKeyOfSize16(key, cipherText, iv) {
	const exportedKey = await window.crypto.subtle.exportKey("raw", key);       
    let guessBuffer = new Uint32Array(exportedKey);
	
	const mask = 0b1111111111111111;
	let times = 2**19;
    guessBuffer[0] &= ~mask;
	//TODO: let fakeBuffer = new Uint32Array(guessBuffer); //
	let decrypted;
	let original = guessBuffer[0];
	let converted;
    
	for (let i = 0; i < times; ++i) {
		guessBuffer[0] = original + i;
		converted = guessBuffer.buffer;
				console.log(guessBuffer);

	try {
		let importedKey = await window.crypto.subtle.importKey("raw", guessBuffer,"AES-GCM", true, ["encrypt","decrypt"]);
    		console.log("Trying new key: ", importedKey);

		let decrypted = await window.crypto.subtle.decrypt(
			{
                        name: "AES-GCM",
                        iv: iv
                    	},
	  		importedKey,
			cipher
		);

		console.log("Encryption suceeded! key was: ", decrypted);
		break;
	}
	catch (e){
		console.log("Decryption failed: ", e, " ", i + 1);
	}
	}
}

findKeyOfSize16(key, cipher, iv);



//testing size of 4, exported key was ....2199, my numbers looped through 2208, 2207, 2206, 2205 all the way to 2199. 
//When I stepped again, it went to 2198. Somehow, decryption failed.
//aha, exportedkey is being changed each time too