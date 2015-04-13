'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _runner = require('../lib/index.js');

var _runner2 = _interopRequireWildcard(_runner);

var _assert = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireWildcard(_sinon);

describe('Running multiple tasks', function () {
    it('Can pass a value that begins at first task', function (done) {

        var spy1 = _sinon2['default'].spy();
        var spy2 = _sinon2['default'].spy();

        var task1 = function task1(deferred, previous) {
            spy1();
            setTimeout(function () {
                return deferred.resolve('task 1');
            }, 200);
        };

        var task2 = function task2(deferred, previous) {
            spy2();
            setTimeout(function () {
                return deferred.resolve('' + previous + ' - task 2');
            }, 200);
        };

        return _runner2['default']([task1, task2]).then(function (result) {
            _assert.assert.equal(result, 'task 1 - task 2');
            _sinon2['default'].assert.calledOnce(spy1);
            _sinon2['default'].assert.calledOnce(spy2);
            done();
        });
    });
    it('Can pass an initial value', function (done) {

        var spy1 = _sinon2['default'].spy();
        var spy2 = _sinon2['default'].spy();

        var task1 = function task1(deferred, previous) {
            spy1();
            setTimeout(function () {
                return deferred.resolve('' + previous + ' - task 1');
            }, 200);
        };

        var task2 = function task2(deferred, previous) {
            spy2();
            setTimeout(function () {
                return deferred.resolve('' + previous + ' - task 2');
            }, 200);
        };

        return _runner2['default']([task1, task2], 'Initial').then(function (result) {
            _assert.assert.equal(result, 'Initial - task 1 - task 2');
            _sinon2['default'].assert.calledOnce(spy1);
            _sinon2['default'].assert.calledOnce(spy2);
            done();
        });
    });
    it('Can run a single task', function (done) {

        var spy1 = _sinon2['default'].spy();

        var task1 = function task1(deferred, previous) {
            spy1();
            setTimeout(function () {
                return deferred.resolve('' + previous + ' - task 1');
            }, 200);
        };

        return _runner2['default']([task1], 'Initial').then(function (result) {
            _assert.assert.equal(result, 'Initial - task 1');
            _sinon2['default'].assert.calledOnce(spy1);
            done();
        });
    });
});