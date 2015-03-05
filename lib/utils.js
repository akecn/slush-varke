var http = require('http'),
    path = require('path'),
    fs = require('fs');
var findup = require('findup-sync');

var pkgBase = findup('package.json', {
    cwd: process.cwd(),
    nocase: true
});
var cwd = path.dirname(pkgBase);

var pkgStat = fs.statSync(pkgBase),
    pkg;

if(pkgStat && pkgStat.isFile()) {
    var contents = fs.readFileSync(pkgBase);
    pkg = JSON.parse(contents.toString())
}

exports.cwd = function() {
    return cwd;
};

exports.pkg = function() {
    return pkg;
};

exports.writePkg = function(json) {
    pkg = json;
    fs.writeFileSync(pkgBase, JSON.stringify(pkg, null, '  '));
};

exports.get = function(url, callback) {
    http.get(url, function(res) {

        if(res.statusCode === 200) {

            var bufs = [];

            res.on('data', function (chunk) {
                bufs.push(new Buffer(chunk));
            });

            res.on('end', function () {

                var contents;

                if(bufs.length >0) {
                    contents = Buffer.concat(bufs).toString();
                }

                if(contents) {

                    callback(null, contents);

                }else {
                    callback(new Error('empty data'));
                }

            });

        }else {

            var error = new Error(res.statusMessage);
            error.code = res.statusCode;
            callback(error);
        }

    }).on('error', function(e) {

        callback(e);
    });
};