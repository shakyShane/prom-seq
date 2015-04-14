var Q = require('q');

function run (tasks, initial) {
    return tasks.reduce((previous, item) => {
        let deferred = Q.defer();
        return previous.then((previousvalue) => {
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