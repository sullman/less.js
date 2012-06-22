(function (tree) {

tree.URL = function (val, paths) {
    if (val.data) {
        this.attrs = val;
    } else {
        // Add the base path if the URL is relative and we are in the browser
        if (val.value && !/^(?:https?:\/\/|file:\/\/|data:|\/)/.test(val.value) && paths.length > 0) {
            if (typeof(window) !== 'undefined') {
                val.value = paths[0] + (val.value.charAt(0) === '/' ? val.value.slice(1) : val.value);
            } else {
                var path = '';
                for (var i = 0; i < paths.length; i++) {
                    path = paths[i] + '/' + path;
                    if (path[0] != '.')
                        break;
                }

                var baseDir = paths[paths.length-1];
                if (path.lastIndexOf(baseDir, 0) === 0) {
                    path = path.substring(baseDir.length + 1);
                }
                path = path + (val.value.charAt(0) === '/' ? val.value.slice(1) : val.value);
                var components = path.split('/');
                for (var i = 0; i < components.length; i++) {
                    if (components[i] === '.') {
                        components.splice(i--, 1);
                    } else if (components[i] === '..' && i > 0 && components[i - 1] !== '..') {
                        components.splice(i - 1, 2);
                        i -= 2;
                    }
                }

                val.relativized = components.join('/');
            }
        }
        this.value = val;
        this.paths = paths;
    }
};
tree.URL.prototype = {
    toCSS: function () {
        return "url(" + (this.attrs ? 'data:' + this.attrs.mime + this.attrs.charset + this.attrs.base64 + this.attrs.data
                                    : this.value.toCSS()) + ")";
    },
    eval: function (ctx) {
        return this.attrs ? this : new(tree.URL)(this.value.eval(ctx), this.paths);
    }
};

})(require('../tree'));
