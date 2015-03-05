var path = require('path'),
    fs = require('fs');
var utils = require('./utils');

var EOL = require('os').EOL;

// fetch package object
exports.fetch = function(name, options, callback) {
    var argSize = arguments.length;
    // current module
    if(argSize === 1) {
        callback = name;

        var pkg = utils.pkg();
        if(pkg) {
            callback(null, pkg);
        }else {
            callback(new Error('invalid package.json'));
        }
        return;
    }

    // external npm module
    if(argSize === 2) {
        callback = options;
        options = {};
    }

    var url = "http://registry.npmjs.org/" + name + "/" + (options.version || "latest");

    utils.get(url, function(err, contents) {
        if(err) {
            callback(err);
            return;
        }
        try {

            callback(null, JSON.parse(contents));

        }catch(ex) {

            callback(ex);
        }
    });

};

exports.setPackage = function(key, value) {

};

exports.version = function(name, options, callback) {
    exports.fetch(name, options, function(err, pkg) {
        if(err) {
            callback(err);
        }else {
            callback(null, pkg['version']);
        }
    });
};

exports.getOwner = function() {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

    var npmrcPath = path.join(homeDir, '.npmrc');
    var npmrc = fs.readFileSync(npmrcPath).toString();

    var data = rcparse(npmrc.toString());

    if(data.username) {
        return data.username;
    }else {
        var rt = new Buffer(data["_auth"], "base64").toString();
        var parts = rt.split(':');

        return parts[0];
    }
};

function rcparse(text) {
    var rt = {};
    text.split(EOL).forEach(function (line) {
        if(line.trim()) {
            var parts = line.split("=");
            var key = parts[0].trim();
            var val = parts[1].trim();

            rt[key] = val;
        }
    });

    return rt;
}