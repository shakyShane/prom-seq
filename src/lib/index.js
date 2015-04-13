function run (tasks, initial) {
    let Q = require("q");
    return tasks.reduce((previous, item) => {
        var deferred = Q.defer();
        return previous.then((previousvalue) => {
            item.call(null, deferred, previousvalue);
            return deferred.promise;
        });
    }, Q.resolve(initial));
}

module.exports = run;

module.exports.create = function (tasks, done) {
    return run.bind(null, tasks, done);
};