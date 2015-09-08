(function () {

    function clone (data, isDeep) {
        if (Array.isArray(data)) {
            var clonedArray = data.slice();
            return isDeep ? clonedArray.map(clone) : clonedArray;
        } else {
            return Object.keys(data).reduce(function (object, key) {
                var value = data[key];
                object[key] = typeof value === 'object' ? clone(value, isDeep) : value;
                return object;
            }, {});
        }
    }

    function find (array, params) {
        var i = 0;
        while (array[i] && !matches(params, array[i])) {
            i++;
        }
        return array[i];
    }

    function matches (a, b) {
        return Object.keys(a).every(function (key) {
            return a[key] === b[key];
        });
    }

    function pick (object, keys) {
        return keys.reduce(function (newObject, key) {
            newObject[key] = object[key];
            return newObject;
        }, {});
    }

    function pluck (array, key) {
        return array.map(function (object) {
            return object[key];
        });
    }

    function unique (array) {
        return array.filter(function (element, i) {
            return array.indexOf(element) === i;
        });
    }

    window.utils = {
        clone: clone,
        find: find,
        pick: pick,
        pluck: pluck,
        unique: unique
    };
})();
