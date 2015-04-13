function run (tasks, initial) {
    let Q = require('q');
    return tasks.reduce((previous, item) => {
        let deferred = Q.defer();
        return previous.then((previousvalue) => {
            item.call(null, deferred, previousvalue);
            return deferred.promise;
        });
    }, Q.resolve(initial));
}

module.exports = run;

module.exports.create = function (tasks) {
    return run.bind(null, tasks);
};