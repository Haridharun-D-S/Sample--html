import { Injectable } from "@angular/core";
// import * as CryptoTS from 'crypto-ts';
import * as crypto from 'crypto-js';
// import DES from 'crypto-js/rc4';
import { environment } from "src/environments/environments";
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: "root"
})
export class EncryptionService {
  key: string = "z!!!!!!!1sdfadsf56adf456asdfasdf";
  appProperties = {
    VALUES: {
      KEY: "MTIzNDU2Nzg5MEFCQ0RFRkdISUpLTE1O",
      IV: "MTIzNDU2Nzg="
    }
  }

  keyFinal: string = 'NovacisDigital PVT Ltd';

  constructor() { }


  
  encrypt(msg) {
    const encryptSecretKey = environment.ENCRYPTKEY; //adding secret key

    const keySize = 256;
    const salt = crypto.lib.WordArray.random(16);
    const key = crypto.PBKDF2(encryptSecretKey, salt, {
      keySize: keySize / 32,
      iterations: 100
    });

    const iv = crypto.lib.WordArray.random(128 / 8);

    const encrypted = crypto.AES.encrypt(msg, key, {
      iv: iv,
      // padding: crypto.pad.Pkcs7,
      // mode: crypto.mode.CBC,

      algorithm: crypto.algo.AES,
      padding: crypto.pad.Pkcs7,
      mode: crypto.mode.CBC
    });

    const result = crypto.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));

    return result;
  }

  
  decrypt(key, ciphertextB64) {

    const key1 = crypto.enc.Utf8.parse(key);
    const iv = crypto.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);

    const decrypted = crypto.AES.decrypt(ciphertextB64, key1, { iv: iv });
    return decrypted.toString(crypto.enc.Utf8);
  }


  
// ENCRYPTION METHOD
  // encryptFinal(message) {
  //   return CryptoJS.AES.encrypt(message, this.key).toString();
  // }

  // // DECRYPTION METHOD
  // decryptFinal(ciphertext) {
  //   const bytes = CryptoJS.AES.decrypt(ciphertext, this.keyFinal);
  //   return bytes.toString(CryptoJS.enc.Utf8);
  // }

encryptFinal(msg) {
  const keySize = 256;
  const salt = CryptoJS.lib.WordArray.random(16);
  const key = CryptoJS.PBKDF2(this.keyFinal, salt, {
    keySize: keySize / 8,
    iterations: 100
  });

  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    algorithm: CryptoJS.algo.AES,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  const result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));

  return result;
}

decryptFinal(ciphertextB64) {
  const keySize = 256;
  const salt = CryptoJS.lib.WordArray.random(16);
  const key1 = CryptoJS.enc.Utf8.parse(this.keyFinal, salt, {
    keySize: keySize / 8,
    iterations: 100
  });
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const decrypted = CryptoJS.AES.decrypt(ciphertextB64, key1, { 
    iv: iv,  
    algorithm: CryptoJS.algo.AES,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC 
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

 encryptNew(plainText: string, passPhrase: string): string {
  const keySize = 256 / 8;
  const ivSize = 16;
  const salt = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(passPhrase, salt, {
    keySize: keySize + ivSize,
    iterations: 1000
  });

  const iv = CryptoJS.lib.WordArray.random(ivSize);
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  return CryptoJS.enc.Base64.stringify(salt) + CryptoJS.enc.Base64.stringify(iv) + encrypted.toString();
}

 decryptNew(cipherText: string, passPhrase: string): string {
  const keySize = 256 / 8;
    const ivSize = 16;
    const salt = CryptoJS.enc.Base64.parse(cipherText.substr(0, 24));
    const iv = CryptoJS.enc.Base64.parse(cipherText.substr(24, 24));
    const encrypted = cipherText.substring(48);

    const key = CryptoJS.PBKDF2(passPhrase, salt, {
      keySize: keySize + ivSize,
      iterations: 1000
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);

    
}


}