import CryptoJS from 'crypto-js';

// 定义密钥和偏移量
const key = CryptoJS.enc.Utf8.parse('wsWcvZhevZ2QzkL+f3x8dw==');
const iv = CryptoJS.enc.Utf8.parse('altoria');

// AES 加密函数
export const encrypt = (data: string): string => {
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
};

// AES 解密函数
export const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return bytes.toString(CryptoJS.enc.Utf8);
};