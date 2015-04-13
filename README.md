## prom-seq [![Build Status](https://travis-ci.org/shakyShane/prom-seq.svg?branch=master)](https://travis-ci.org/shakyShane/prom-seq)

> Just a sequence of promises where each task receives
 a deferred + previous value

```js

import runner from 'prom-seq';
import assert from 'assert'; 

// Async task 1
let task1 = function (deferred, previous) {
    setTimeout(() => deferred.resolve(`${previous} - task 1`), 200);
};

// Async task 2
let task2 = function (deferred, previous) {
    setTimeout(() => deferred.resolve(`${previous} - task 2`), 200);
};

// Run tasks in sequence 
return runner([task1, task2], 'Initial').then((result) => {
    assert.equal(result, 'Initial - task 1 - task 2');
});
```

