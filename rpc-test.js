const rpc = (function () {
    /**
     *
     * @type {Object[]}
     */
    let _requests = [];
    let _callbacks = {};
    let _fetchConfig = {};

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

    /**
     *
     * @return {*[]}
     */
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
            if (body?.id) {
                _callbacks[body.id] = {
                    success: typeof v?.success === 'function' ? v.success : ((data, id) => {
                        console.log('success', `id:${id}`, data);
                    }),
                    fail: typeof v?.fail === 'function' ? v.fail : ((err, id) => {
                        console.log('fail', `id:${id}`, err);
                    })
                };
            }
        });
    };
    /**
     *
     * @param {Object} [config]
     * @return Object
     */
    const makeFetchConfig = (config) => {
        if (typeof config !== 'object') {
            config = {};
        }
        const cfg = Object.assign({}, defaultFetchConfig, _fetchConfig, config);
        if (cfg.method.toLowerCase() !== 'get') {
            cfg.body = JSON.stringify(makeRequestBody());
            makeCallbacks();
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
        console.log('send', _requests, _callbacks);
        const cfg = makeFetchConfig(config);
        const response = fetch(endpoint, cfg).then(res => res.json());
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

    /**
     *
     * @param {Object[]|Object} res
     */
    const parseSendResponse = (res) => {
        if (!Array.isArray(res)) {
            Object.values(_callbacks).forEach(cb => {
                const _cb = res.hasOwnProperty('error') ? cb.fail : cb.success;
                _cb(res);
            });
            return;
        }
        res.forEach(v => {
            if (!v?.id) return;
            if (!_callbacks.hasOwnProperty(v.id)) return;
            if (v?.error) {
                _callbacks[v.id].fail(v.error, v.id);
            }
            if (v?.result) {
                _callbacks[v.id].success(v.result, v.id);
            }
        });
    };

    const parseSendError = (err) => {
        Object.values(_callbacks).forEach(v => {
            if (typeof v?.fail === 'function') {
                v.fail(err);
            }
        });
    };

    const clearRequest = () => {
        _requests = [];
        _callbacks = {};
    };

    return {
        debug: function () {
            console.log('fetchConfig', _fetchConfig);
            console.log('requests', _requests);
            console.log('callbacks', _callbacks);
            return this;
        },
        /**
         *
         * @param {Object} config
         * @returns {*}
         */
        setFetchConfig: function (config) {
            _fetchConfig = config;
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
