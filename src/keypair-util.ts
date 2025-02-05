import * as fs from 'fs';
import * as crypto from 'crypto';
import { Keypair } from '@solana/web3.js';

// 生成一个新的 Keypair
const keypair = Keypair.generate();

// 获取密钥的 secretKey（即私钥）
const secretKey = keypair.secretKey;

// 加密密钥
const encryptKey = (key: Uint8Array, passphrase: string): string => {
  const iv = crypto.randomBytes(16); // 初始化向量（IV）
  const keyBuffer = crypto.scryptSync(passphrase, 'salt', 32); // 使用 passphrase 派生加密密钥
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv); // 使用 AES-256-CBC 加密算法
  const encrypted = Buffer.concat([cipher.update(key), cipher.final()]);
  return JSON.stringify({ iv: iv.toString('hex'), encrypted: encrypted.toString('hex') });
};

// 解密密钥
const decryptKey = (encryptedData: string, passphrase: string): Uint8Array => {
  const { iv, encrypted } = JSON.parse(encryptedData);
  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedBuffer = Buffer.from(encrypted, 'hex');
  const keyBuffer = crypto.scryptSync(passphrase, 'salt', 32); // 使用 passphrase 派生加密密钥
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted;
};

// 加密保存密钥
export const saveEncryptedKey = (secretKey: Uint8Array, passphrase: string, filePath: string) => {
  const encryptedKey = encryptKey(secretKey, passphrase);
  fs.writeFileSync(filePath, encryptedKey);
  console.log('The key is encrypted and saved.');
};

// 解密加载密钥
export const loadEncryptedKey = (filePath: string, passphrase: string): Keypair => {
  const encryptedKey = fs.readFileSync(filePath, 'utf8');
  const decryptedKey = decryptKey(encryptedKey, passphrase);
  return Keypair.fromSecretKey(decryptedKey);
};

export const loadKeypair = (filePath: string): Keypair => {
  const keypairData = fs.readFileSync(filePath, 'utf8');
  const secretKey = JSON.parse(keypairData);
  return Keypair.fromSecretKey(new Uint8Array(secretKey));
};

/*
// 使用示例
const passphrase = ''; // 用于加密解密的密码

// 保存加密的密钥
const filePath = '';
// saveEncryptedKey(secretKey, passphrase, filePath);

// 从文件加载解密的密钥
const loadedKeypair = loadEncryptedKey(filePath, passphrase);
console.log('加载的公钥:', loadedKeypair.publicKey.toBase58());
*/