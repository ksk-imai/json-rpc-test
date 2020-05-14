const rpc = (function () {
    const me = this;
    /**
     *
     * @type {Object[]}
     */
    let requests = [];

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
        let id = 1;
        return requests.map(v => {
            const body = Object.assign({}, v.body);
            body['jsonrpc'] = '2.0';
            if (v?.success) {
                body['id'] = id++;
            }
            return v;
        })
    };
    const makeFetchConfig = (config) => {
        if (typeof config !== 'object') {
            config = {};
        }
        const cfg = Object.assign({}, defaultFetchConfig, fetchConfig, config);
        cfg.body = JSON.stringify(makeRequestBody());
        return cfg;
    };

    const send = (endpoint, config) => {
        const cfg = makeFetchConfig(config);
        return new Promise((resolve, reject) => {
            const response = fetch(endpoint, cfg).then(res => res.json());
            response.then(value => {
                resolve(value);
            }).catch(reason => {
                reject(reason);
            }).finally(() => {
                requests = [];
            });
        });
    };


    return {
        debug: () => {
            console.log('requests', requests);
            console.log('makeRequestBody', makeRequestBody());
            console.log('makeFetchConfig', makeFetchConfig());
        },
        /**
         *
         * @param {Object} config
         * @returns {*}
         */
        setFetchConfig: config => {
            fetchConfig = config;
            return me;
        },
        /**
         *
         * @param {String} method
         * @param {Object|Array} params
         * @param {Function} success
         * @param {Function} fail
         * @returns {*}
         */
        addRequest: (method, params, success, fail) => {
            return this.addRequests([{
                body: {
                    method: method,
                    params: params
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
        addRequests: requests => {
            if (!Array.isArray(requests)) {
                return false;
            }
            if (requests.findIndex(v => !v?.body?.method || !v?.body?.params) !== -1) {
                return false;
            }
            requests.forEach((v, idx) => {
                const success = typeof v?.success === 'function' ? v.success : null;
                const fail = typeof v?.fail === 'function' ? v.fail : null;
                requests.push({
                    body: {
                        method: v.method,
                        params: v.params
                    },
                    success: success,
                    fail: fail
                });
            });
            return me;
        },
        /**
         *
         * @param {String} endpoint Endpoint
         * @param {Object} [config]
         * @return {Promise<unknown>}
         */
        send: (endpoint, config) => {
            return send(endpoint, config);
        }
    };
})();

const rq = [
    {
        body: {method: 'one', params: {key: 'one'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
    {
        body: {method: 'two', params: {key: 'two'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
    {
        body: {method: 'three', params: {key: 'three'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
    {
        body: {method: 'four', params: {key: 'four'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
    {
        body: {method: 'five', params: {key: 'five'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
    {
        body: {method: 'six', params: {key: 'six'}}
    },
    {
        body: {method: 'seven', params: {key: 'seven'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
    {
        body: {method: 'eight', params: {key: 'eight'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
    {
        body: {method: 'nine', params: {key: 'nine'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
    {
        body: {method: 'ten', params: {key: 'ten'}},
        success: () => console.log(`success ${this.body.method}`),
        fail: () => console.log(`fail ${this.body.method}`)
    },
];
rpc.setFetchConfig({})
    .addRequests(rq)
    .debug();







