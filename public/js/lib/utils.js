var Utils = Utils || {
    deparam: function (uri) {
        if (uri === undefined) { uri = window.location.search; }
        let queryString = {};
        uri.replace(/([^?=&]+)(=([^&#]*))?/g, ($0, $1, $2, $3) => queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20')));
        return queryString;
    }
}