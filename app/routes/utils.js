function respondWithQuery (fn, successCode) {
    successCode || (successCode = 200);

    return function (req, res, next) {
        function onSuccess (result) {
            res.status(successCode);
            if (result && successCode !== 204) {
                res.json(result);
            } else {
                res.end();
            }
        }

        fn(req).then(onSuccess, next);
    }
}

module.exports = {
    respondWithQuery: respondWithQuery
}
