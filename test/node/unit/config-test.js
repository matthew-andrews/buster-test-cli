var helper = require("../test-helper");
var buster = require("buster");
var testConfig = helper.require("config");
buster.configuration = require("buster-client").configuration;
var assert = buster.assert;
var version = require("../../../lib/buster-test-cli").VERSION;

buster.testCase("Test client configuration", {
    setUp: function () {
        helper.writeFile("cfg.js", "var config = module.exports;" +
                         "config['client tests'] = {};" +
                         "config['server tests'] = { environment: 'node' };");

        process.chdir(helper.FIXTURES_ROOT);
    },

    tearDown: helper.clientTearDown,

    "should preload session configuration with library": function (done) {
        this.stub(Date, "now").returns(11111111);
        testConfig.loadModule("cfg.js")

        testConfig.eachGroup("browsers", function (err, config) {
            config.sessionConfig.configure().then(function (conf) {
                var res = conf.resources;
                assert.isObject(res["/buster/buster-core.js"]);
                assert.isObject(res["/buster/buster-event-emitter.js"]);
                assert.isObject(res["/buster/buster-evented-logger.js"]);
                assert.isObject(res["/buster/buster-assert.js"]);
                assert.isObject(res["/buster/buster-format.js"]);
                assert.isObject(res["/buster/buster-promise.js"]);
                assert.isObject(res["/buster/sinon.js"]);
                assert.isObject(res["/buster/sinon/spy.js"]);
                assert.isObject(res["/buster/sinon/stub.js"]);
                assert.isObject(res["/buster/sinon/mock.js"]);
                assert.isObject(res["/buster/sinon/collection.js"]);
                assert.isObject(res["/buster/sinon/sandbox.js"]);
                assert.isObject(res["/buster/sinon/test.js"]);
                assert.isObject(res["/buster/sinon/test_case.js"]);
                assert.isObject(res["/buster/sinon/assert.js"]);
                assert.isObject(res["/buster/sinon/util/fake_xml_http_request.js"]);
                assert.isObject(res["/buster/sinon/util/fake_timers.js"]);
                assert.isObject(res["/buster/sinon/util/fake_server.js"]);
                assert.isObject(res["/buster/sinon/util/fake_server_with_clock.js"]);
                assert.isObject(res["/buster/buster-test/spec.js"]);
                assert.isObject(res["/buster/buster-test/test-case.js"]);
                assert.isObject(res["/buster/buster-test/test-context-filter.js"]);
                assert.isObject(res["/buster/buster-test/test-runner.js"]);
                assert.isObject(res["/buster/buster-test/reporters/json-proxy.js"]);
                assert.isObject(res["/buster/sinon-buster.js"]);
                assert.isObject(res["/buster/bundle-" + version + "-11111111.js"]);
                assert.isObject(res["/buster/sinon/util/timers_ie.js"]);
                assert.isObject(res["/buster/sinon/util/xhr_ie.js"]);
                assert.isObject(res["/buster/wiring.js"]);

                assert.match(conf.load, [
                    "/buster/bundle-" + version + "-11111111.js",
                    "/buster/compat-" + version + ".js"]);

                done();
            });
        });
    },

    "should not extend node configuration": function (done) {
        testConfig.loadModule("buster.js");

        testConfig.eachGroup("node", function (err, config) {
            assert.isUndefined(config.sessionConfig);
            done();
        });
    }
});
