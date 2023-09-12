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
    //console.log("exportedKey: ", exportedKey);
    let guessBuffer = new Int32Array(exportedKey);
	//console.log("guessBuffer: ", guessBuffer);
	const mask = 0b11;
	
    guessBuffer[0] &= ~mask;
    let final = guessBuffer;
	for (let i = 0; i < 4; ++i) {
		
		final[0] = guessBuffer[0] + i;
		//guessBuffer[0] &= ~mask;
        	//console.log("guess: ", guessBuffer);
		//console.log("final buffer: ", final)	;
	



	try {
		let importedKey = await window.crypto.subtle.importKey("raw", final,"AES-GCM", true, ["encrypt","decrypt"]);
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
    //console.log("exportedKey: ", exportedKey);
    let guessBuffer = new Int32Array(exportedKey);
	//TODO: SOMEWHERE I AM DIRECTLY ACCESSING EXPORTEDKEY, GUESSBUFFER BE A VIEW
	//ARRAY
	//console.log("guessBuffer: ", guessBuffer);
	const mask = 0b1111;
	
    guessBuffer[0] &= ~mask;
    //const maskedBuffer = guessBuffer;
    let final = guessBuffer;
	
	for (let i = 0; i < 16; ++i) {
		final[0] = guessBuffer[0] + i;
		guessBuffer[0] &= ~mask;
	
        //guessBuffer[0] = maskedBuffer[0];
        

	try {
		let importedKey = await window.crypto.subtle.importKey("raw", final,"AES-GCM", true, ["encrypt","decrypt"]);
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
findKeyOfSize4(key, cipher, iv);


//testing size of 4, exported key was ....2199, my numbers looped through 2208, 2207, 2206, 2205 all the way to 2199. 
//When I stepped again, it went to 2198. Somehow, decryption failed.
//aha, exportedkey is being changed each time too