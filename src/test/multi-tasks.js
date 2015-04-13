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
});