'use strict';

var Q = require('q');

function run() {
    var tasks = arguments[0];
    var initial = arguments[1];
    var context = arguments[2];

    var end = Q.defer();
    var list = tasks.reduce(function (previous, item) {
        var deferred = Q.defer();
        deferred.promise.progress(end.notify);
        return previous.then(function (previousvalue) {
            item(deferred, previousvalue, context);
            return deferred.promise;
        });
    }, Q.resolve(initial));
    list.then(end.resolve)['catch'](end.reject);
    return end.promise;
}

module.exports = run;
module.exports.defer = Q.defer;
module.exports.Q = Q;

module.exports.create = function (tasks) {

    return run.bind(null, flatten([], tasks));
};

function flatten(initial, arr) {

    arr.forEach(function (item) {
        if (Array.isArray(item)) {
            flatten(initial, item);
        } else {
            initial.push(item);
        }
    });

    return initial;
}