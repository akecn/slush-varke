"use strict";
var utils = require('./utils');
var semver = require('semver');
var path = require('path');
var fs = require('fs');
var findup = require('findup-sync');
var npmStat = require('./npm-stat');

module.exports = version;

var tags = "major premajor minor preminor patch prepatch prerelease".split(' ');

function hasPermission(list) {
    var owner = npmStat.getOwner();

    return list.some(function(item) {
        return owner === item.name;
    });
}

function version(done) {
    var argv = require('optimist').argv;
    var to = argv.to,
        tag = argv.tag;

    npmStat.fetch(function(err, pkg) {
        if(err) {
            console.log('error', err.message);
            done();
            return;
        }

        npmStat.fetch(pkg.name, function(err2, pkgRemote) {
            if(err2) {
                console.log('error2', err2.message);
                done();
                return ;
            }

            if(hasPermission(pkgRemote.maintainers)) {
                tag = ~tags.indexOf(tag) ? tag : 'patch';
                var ov = pkg.version,
                    nv = semver.valid(to) ? to : semver.inc(pkgRemote.version, tag);

                if(semver.diff(ov, nv)) {
                    pkg.version = nv;
                    utils.writePkg(pkg);

                    console.log("update by tag %s. from %s to %s", tag, ov, nv);
                }else {
                    console.log('version %s is latest.', nv)
                }
            }else {
                console.log('are you the npm module "%s" owner?', pkg.name);
            }
            done();
        });
    });
}