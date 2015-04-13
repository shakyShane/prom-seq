"use strict";

function run(tasks, initial) {
    var Q = require("q");
    return tasks.reduce(function (previous, item) {
        var deferred = Q.defer();
        return previous.then(function (previousvalue) {
            item.call(null, deferred, previousvalue);
            return deferred.promise;
        });
    }, Q.resolve(initial));
}

module.exports = run;

module.exports.create = function (tasks, done) {
    return run.bind(null, tasks, done);
};