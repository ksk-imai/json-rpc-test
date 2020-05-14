const rpc = (function () {
    /**
     *
     * @type {Object[]}
     */
    let _requests = [];
    let _callbacks = {};

    const defaultFetchConfig = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: "" // body: JSON.stringify(data), // 本文のデータ型は "Content-Type" ヘッダーと一致する必要があります
    };
    let fetchConfig = {};

    const makeRequestBody = () => {
        return _requests.map(v => {
            const body = Object.assign({}, v.body);
            body['jsonrpc'] = '2.0';
            return body;
        });
    };
    const makeCallbacks = () => {
        _requests.forEach(v => {
            const body = Object.assign({}, v.body);
            console.log('makeCallbacks', body);
            if (body?.id) {
                _callbacks[body.id] = {
                    success: typeof v?.success === 'function' ? v.success : (() => {
                    }),
                    fail: typeof v?.fail === 'function' ? v.fail : (() => {
                    })
                };
            }
        });
        console.log('makeCallbacks', _callbacks);
    };
    const makeFetchConfig = (config) => {
        if (typeof config !== 'object') {
            config = {};
        }
        const cfg = Object.assign({}, defaultFetchConfig, fetchConfig, config);
        if (cfg.method.toLowerCase() !== 'get') {
            cfg.body = JSON.stringify(makeRequestBody());
        } else {
            delete cfg.body;
        }
        return cfg;
    };

    /**
     *
     * @param {String} endpoint
     * @param {Object} [config]
     */
    const send = (endpoint, config) => {
        console.log('send', _requests);
        const cfg = makeFetchConfig(config);
        const response = fetch(endpoint, cfg).then(res => res.json());
        makeCallbacks();
        response.then(value => {
            console.log('then');
            parseSendResponse(value);
        }).catch(reason => {
            console.log('catch')
            parseSendError(reason);
        }).finally(() => {
            clearRequest();
        });
    };

    const parseSendResponse = (res) => {
        console.log(res);
        if (!Array.isArray(res)) {
            console.log(_callbacks);
            Object.values(_callbacks).forEach(cb => {
                console.log(cb);
                const _cb = res.hasOwnProperty('error') ? cb.fail : cb.success;
                _cb(res);
            });
            return;
        }
    };

    const parseSendError = (err) => {
        console.log(err);
    };

    const clearRequest = () => {
        _requests = [];
        _callbacks = {};
    };

    return {
        debug: function () {
            console.log('requests', _requests);
            console.log('makeRequestBody', makeRequestBody());
            console.log('makeFetchConfig', makeFetchConfig());
            return this;
        },
        /**
         *
         * @param {Object} config
         * @returns {*}
         */
        setFetchConfig: function (config) {
            fetchConfig = config;
            return this;
        },
        /**
         *
         * @param {String} method
         * @param {Object|Array} params
         * @param {String} id
         * @param {Function} success
         * @param {Function} fail
         * @returns {*}
         */
        addRequest: function (method, params, id, success, fail) {
            return this.addRequests([{
                body: {
                    method: method,
                    params: params,
                    id: id
                },
                success: success,
                fail: fail
            }]);
        },
        /**
         *
         * @param {Object[]} requests
         * @returns {*|boolean}
         */
        addRequests: function (requests) {
            if (!Array.isArray(requests)) {
                return false;
            }
            if (requests.findIndex(v => !v?.body?.method || !v?.body?.params) !== -1) {
                return false;
            }
            requests.forEach(v => {
                const body = v?.body;
                const id = body?.id ? '' + body.id : null;
                const success = typeof v?.success === 'function' ? v.success : null;
                const fail = typeof v?.fail === 'function' ? v.fail : null;
                _requests.push({
                    body: {
                        method: body.method,
                        params: body.params,
                        id: id
                    },
                    success: success,
                    fail: fail
                });
            });
            return this;
        },
        /**
         *
         * @param {String} endpoint Endpoint
         * @param {Object} [config]
         */
        send: function (endpoint, config) {
            send(endpoint, config);
        },
        clearRequest: function () {
            clearRequest();
            return this;
        }
    };
})();

const rq = [
    {
        body: {method: 'one', params: {key: 'one'}, id: 'one'},
        success: (val) => console.log(`success one`, val),
        fail: (err) => console.log(`fail one`, err)
    },
    {
        body: {method: 'two', params: {key: 'two'}, id: 'two'},
        success: (val) => console.log(`success two`, val),
        fail: (err) => console.log(`fail two`, err)
    },
    {
        body: {method: 'three', params: {key: 'three'}, id: 'three'},
        success: (val) => console.log(`success three`, val),
        fail: (err) => console.log(`fail three`, err)
    },
    {
        body: {method: 'four', params: {key: 'four'}, id: 'four'},
        success: (val) => console.log(`success four`, val),
        fail: (err) => console.log(`fail four`, err)
    },
    {
        body: {method: 'five', params: {key: 'five'}, id: 'five'},
        success: (val) => console.log(`success five`, val),
        fail: (err) => console.log(`fail five`, err)
    },
    {
        body: {method: 'six', params: {key: 'six'}}
    },
    {
        body: {method: 'seven', params: {key: 'seven'}, id: 'seven'},
        success: (val) => console.log(`success seven`, val),
        fail: (err) => console.log(`fail seven`, err)
    },
    {
        body: {method: 'eight', params: {key: 'eight'}, id: 'eight'},
        success: (val) => console.log(`success eight`, val),
        fail: (err) => console.log(`fail eight`, err)
    },
    {
        body: {method: 'nine', params: {key: 'nine'}, id: 'nine'},
        success: (val) => console.log(`success nine`, val),
        fail: (err) => console.log(`fail nine`, err)
    },
    {
        body: {method: 'ten', params: {key: 'ten'}, id: 'ten'},
        success: (val) => console.log(`success ten`, val),
        fail: (err) => console.log(`fail ten`, err)
    },
];
rpc.setFetchConfig({})
    .addRequests(rq)
    .debug()
    .send('https://yesno.wtf/api', {method: 'get'});
