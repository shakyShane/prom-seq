let Q = require('q');

function run (...args) {
    let tasks = args[0];
    let initial = args[1];
    let context = args[2];

    let end = Q.defer();
    let list = tasks.reduce((previous, item) => {
        let deferred = Q.defer();
        deferred.promise.progress(end.notify);
        return previous.then((previousvalue) => {
            item(deferred, previousvalue, context);
            return deferred.promise;
        });
    }, Q.resolve(initial));
    list.then(end.resolve).catch(end.reject);
    return end.promise;
}

module.exports = run;
module.exports.defer = Q.defer;
module.exports.Q = Q;

module.exports.create = function (tasks) {

    return run.bind(null, flatten([], tasks));
};

function flatten (initial, arr) {

    arr.forEach(function (item) {
        if (Array.isArray(item)) {
            flatten(initial, item);
        } else {
            initial.push(item);
        }
    });

    return initial;
}

