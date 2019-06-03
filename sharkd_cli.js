const net = require('net');
const process = require('process');
const {PromiseSocket} = require('promise-socket');

class SharkdCli {

  handleExit(signal, promiseSocket) {
    console.log(`Received ${signal}, exiting`);    
    promiseSocket.destroy();
    process.exit(0);
  }

  constructor(socket_fd) {
    this.client = new net.Socket();
    this.client.connect(socket_fd);
    this.client.setEncoding('utf8');
    this.promiseSocket = new PromiseSocket(this.client);

    process.on('SIGINT', (signal) => {this.handleExit(signal, this.promiseSocket)});
    process.on('SIGTERM', (signal) => {this.handleExit(signal, this.promiseSocket)});
    process.on('exit', (signal) => {this.handleExit(signal, this.promiseSocket)});  
  }

  async send_req(request) {
    await this.promiseSocket.write(JSON.stringify(request)+"\n");    
    return await this.promiseSocket.read();
  }

}

module.exports = SharkdCli;