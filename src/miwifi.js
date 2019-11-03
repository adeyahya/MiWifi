const urljoin = require('url-join');
const querystring = require('querystring');
const axios = require('axios');
const Encrypt = require('./Encrypt');

class MiWifi {
  constructor(params = {}) {
    if (!params.mac) {
      throw new Error("Need mac to initialize MiWifi!");
    }
    this.address = params.address || 'http://miwifi.com';
    this.token = null;
    this.miwifi_type = params.miwifi_type || 0;
    this.encrypt = new Encrypt(params.mac);
  }

  buildurl(path) {
    return urljoin(this.address, path);
  }

  getApiEndpoint(endpoint) {
    return axios.get(urljoin(this.address, '/cgi-bin/luci/;stok=' + this.token, '/api/', endpoint));
  }

  login(password) {
    const nonce = this.encrypt.init();
    const oldPwd = this.encrypt.oldPwd(password);
    const param = {
      username: 'admin',
      password: oldPwd,
      logtype: 2,
      nonce: nonce
    };

    axios.post(this.buildurl('/cgi-bin/luci/api/xqsystem/login'), querystring.stringify(param)).then(result => {
      this.token = result.data.token;
      this.status().then(res => {
        console.log(res.data);
      })
    });
  }

  logout() {
    return axios.get(urljoin(this.address, '/cgi-bin/luci/;stok=' + this.token, 'web', 'logout'));
  }

  status() {
    return this.getApiEndpoint('misystem/status');
  }

  deviceList() {
    return this.getApiEndpoint('misystem/devicelist');
  }

  setWanOff(mac) {
    return this.getApiEndpoint(`xqsystem/set_mac_filter?mac=${mac}&wan=0`);
  }

  setWanOn(mac) {
    return this.getApiEndpoint(`xqsystem/set_mac_filter?mac=${mac}&wan=1`);
  }

  getWifiDetail() {
    return this.getApiEndpoint('xqnetwork/wifi_detail_all');
  }
}

// const wifi = new MiWifi({mac: 'f0:18:98:a8:75:f6'});
// wifi.login('password');