(function () {
    rpc.setFetchConfig({})
        .debug();

    const sampleRequest = [
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

    /**
     *
     * @param {Event} ev
     */
    const listener = (ev) => {
        ev.preventDefault();
        const $this = ev.currentTarget;
        const action = $this?.action;
        const method = $this?.method;
        console.log(method, action);
        rpc.addRequests(sampleRequest)
            .send(action, {method: method});
    };

    // event bind
    document.querySelectorAll('form.test-case').forEach(elm => {
        elm.addEventListener('submit', listener);
    });

})();