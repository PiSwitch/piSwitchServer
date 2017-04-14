var token = require('../lib/token');
var io = require('socket.io-client');
var config = require('../../config.json');

module.exports = function (app) {

    var client = io(config.masterServerUrl, { autoConnect: false });

    client.on('connect', function () {
        console.info('Connected!');
        client.emit('authenticate', {token: token.get()});
    });
    client.on('disconnect', function () {
        console.info('Disconnected!');
        refreshToken();
    });

    client.on('bad token', function (msg) {
        console.warn('Bad token! Refreshing...');
        token = '';
    });

    this.getIo = function () {
        return client;
    };

    this.connect = function(callback) {
        console.info('Attempting to connect to remote socket server...')
        token.refresh(function(error) {
            if(error) {
                return callback(error);
            }
            client.open();
        });
    };

    return this;
};