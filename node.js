'use strict';
var lib = require('./lib.js');

module.exports = function (RED) {
    function IssLocationNode(config) {
        RED.nodes.createNode(this, config);
        this.method = config.method;
        var node = this;

        node.on('input', function (msg) {
            var errorFlag = false;
            var client = new lib.IssLocation();
            if (!errorFlag) {
                client.body = msg.payload;
            }

            var result;
            if (!errorFlag && node.method === 'ISSLocationNow') {
                var ISSLocationNow_parameters = [];
                var ISSLocationNow_nodeParam;
                var ISSLocationNow_nodeParamType;
                result = client.ISSLocationNow(ISSLocationNow_parameters);
            }
            if (!errorFlag && result === undefined) {
                node.error('Method is not specified.', msg);
                errorFlag = true;
            }
            var setData = function (msg, data) {
                if (data) {
                    if (data.response) {
                        if (data.response.statusCode) {
                            msg.statusCode = data.response.statusCode;
                        }
                        if (data.response.headers) {
                            msg.headers = data.response.headers;
                        }
                        if (data.response.request && data.response.request.uri && data.response.request.uri.href) {
                            msg.responseUrl = data.response.request.uri.href;
                        }
                    }
                    if (data.body) {
                        msg.payload = data.body;
                    }
                }
                return msg;
            };
            if (!errorFlag) {
                node.status({ fill: 'blue', shape: 'dot', text: 'IssLocation.status.requesting' });
                result.then(function (data) {
                    node.send(setData(msg, data));
                    node.status({});
                }).catch(function (error) {
                    var message = null;
                    if (error && error.body && error.body.message) {
                        message = error.body.message;
                    }
                    node.error(message, setData(msg, error));
                    node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.error' });
                });
            }
        });
    }

    RED.nodes.registerType('iss-location', IssLocationNode);
};
