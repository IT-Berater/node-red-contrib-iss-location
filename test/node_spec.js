var should = require('should');
var helper = require('node-red-node-test-helper');
var node = require('../node.js');

helper.init(require.resolve('node-red'));

describe('iss-location node', function () {

    before(function (done) {
        helper.startServer(done);
    });

    after(function (done) {
        helper.stopServer(done);
    });

    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ id: 'n1', type: 'iss-location', name: 'iss-location' }];
        helper.load(node, flow, function () {
            var n1 = helper.getNode('n1');
            n1.should.have.property('name', 'iss-location');
            done();
        });
    });

    it('should handle ISSLocationNow()', function (done) {
        var flow = [
            { id: 'n1', type: 'iss-location', name: 'iss-location',
                method: 'ISSLocationNow',
                wires: [['n3']]
            },
            { id: 'n3', type: 'helper' }
        ];
        helper.load(node, flow, function () {
            var n3 = helper.getNode('n3');
            var n1 = helper.getNode('n1');
            n3.on('input', function (msg) {
                try {
                    msg.payload.iss_position.latitude.should.be.within(-90, 90); // (3) define output message
                    msg.payload.iss_position.longitude.should.be.within(-180, 180); // (3) define output message
                    done();
                } catch (e) {
                    done(e);
                }
            });
            n1.receive({}); // (2) define input message
        });
    });
});
