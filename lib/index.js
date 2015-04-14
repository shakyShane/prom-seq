'use strict';

var Q = require('q');

function run(tasks, initial) {
    return tasks.reduce(function (previous, item) {
        var deferred = Q.defer();
        return previous.then(function (previousvalue) {
            item.call(null, deferred, previousvalue);
            return deferred.promise;
        });
    }, Q.resolve(initial));
}

module.exports = run;
module.exports.defer = Q.defer;

module.exports.create = function (tasks) {
    return run.bind(null, tasks);
};