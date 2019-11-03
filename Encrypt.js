const CryptoJS = require("crypto-js");

class Encrypt {
  constructor(mac) {
    this.mac = mac;
    this.key = 'a2ffa5c9be07488bbb04a3a47d3c5f6a';
    this.iv = '64175472480004614961023454661220';
    this.nonce = null;
  }

  init() {
    const nonce = this.nonceCreat();
    this.nonce = nonce;
    return this.nonce;
  }

  nonceCreat() {
    const type = 0;
    const time = Math.floor(new Date().getTime() / 1000);
    const random = Math.floor(Math.random() * 10000);
    return [type, this.mac, time, random].join('_');
  }

  oldPwd(pwd) {
    return CryptoJS.SHA1(this.nonce + CryptoJS.SHA1(pwd + this.key).toString()).toString();
  }

  newPwd(pwd, newpwd) {
    let key = CryptoJS.SHA1(pwd + this.key).toString();
    key = CryptoJS.enc.Hex.parse(key).toString();
    key = key.substr(0, 32);
    key = CryptoJS.enc.Hex.parse(key);
    const password = CryptoJS.SHA1(newpwd + this.key).toString();
    const iv = CryptoJS.enc.Hex.parse(this.iv);
    const aes = CryptoJS.AES.encrypt(
        password,
        key,
        {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
      ).toString();
    return aes;
  }
}

module.exports = Encrypt;