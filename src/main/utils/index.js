function _debounce(fn, delay = 300) {
    var timer = null;
    return function () {
        var _this = this;
        var args = arguments;
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(_this, args);
        }, delay);
    };
}
export {
    _debounce
}
