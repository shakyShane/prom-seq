import runner from '../lib/index.js';
import assert from 'assert';
import sinon  from 'sinon';

describe('Running multiple tasks', () => {
    it('Can pass a value that begins at first task', done => {

        let spy1 = sinon.spy();
        let spy2 = sinon.spy();

        let task1 = function (deferred) {
            spy1();
            setTimeout(() => deferred.resolve('task 1'), 200);
        };

        let task2 = function (deferred, previous) {
            spy2();
            setTimeout(() => deferred.resolve(`${previous} - task 2`), 200);
        };

        return runner([task1, task2]).then((result) => {
            assert.equal(result, 'task 1 - task 2');
            sinon.assert.calledOnce(spy1);
            sinon.assert.calledOnce(spy2);
            done();
        });
    });
    it('Can pass an initial value', done => {

        let spy1 = sinon.spy();
        let spy2 = sinon.spy();

        let task1 = function (deferred, previous) {
            spy1();
            setTimeout(() => deferred.resolve(`${previous} - task 1`), 200);
        };

        let task2 = function (deferred, previous) {
            spy2();
            setTimeout(() => deferred.resolve(`${previous} - task 2`), 200);
        };

        return runner([task1, task2], 'Initial').then((result) => {
            assert.equal(result, 'Initial - task 1 - task 2');
            sinon.assert.calledOnce(spy1);
            sinon.assert.calledOnce(spy2);
            done();
        });
    });
    it('Can run a single task', done => {

        let spy1 = sinon.spy();

        let task1 = function (deferred, previous) {
            spy1();
            setTimeout(() => deferred.resolve(`${previous} - task 1`), 200);
        };

        return runner([task1], 'Initial').then((result) => {
            assert.equal(result, 'Initial - task 1');
            sinon.assert.calledOnce(spy1);
            done();
        });
    });

    it('Creating a bound function', done => {

        let spy1 = sinon.spy();

        let task1 = function (deferred, previous) {
            spy1();
            setTimeout(() => deferred.resolve(`${previous} - task 1`), 200);
        };

        let all = runner.create([task1]);

        return all('Initial').then((result) => {
            assert.equal(result, 'Initial - task 1');
            sinon.assert.calledOnce(spy1);
            done();
        });
    });

    it('exposes Q.defer for skipping some tasks', function () {

        let task1 = function (deferred, previous) {
            setTimeout(() => deferred.resolve(`${previous} - task 1`), 200);
            return deferred.promise;
        };

        return task1(runner.defer(), 'Initial')
            .then((res) => {
                assert.equal(res, 'Initial - task 1');
            });
    });

    it('flattens arrays in arrays', function () {

        let callCount = 0;
        let task1 = function (deferred, previous) {
            callCount += 1;
            setTimeout(() => deferred.resolve(previous + ' ' + callCount), 0);
            return deferred.promise;
        };

        let arr = [task1, task1, [task1, task1, [task1, task1, [task1, task1]]]];

        let all = runner.create(arr);

        return all('0')
            .then((out) => {
                assert.equal(callCount, 8);
                assert.equal(out, '0 1 2 3 4 5 6 7 8');
            });
    });

    it('Propagates progress messages', function () {

        let task1 = function (deferred) {
            deferred.notify('From task 1');
            deferred.resolve();
        };

        let task2 = function (deferred) {
            deferred.notify('From task 2');
            deferred.resolve();
        };

        let arr = [task1, task2];
        let spy = sinon.spy();
        let all = runner.create(arr);

        return all()
            .progress(spy)
            .then(function () {
                sinon.assert.calledTwice(spy);
                sinon.assert.calledWithExactly(spy, 'From task 1');
                sinon.assert.calledWithExactly(spy, 'From task 2');
            });
    });
});
