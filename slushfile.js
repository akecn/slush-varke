/*
 * slush-varke
 * https://github.com/akecn/slush-varke
 *
 * Copyright (c) 2014, wuake
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    iniparser = require('iniparser'),
    inquirer = require('inquirer'),
    moment = require('moment'),
    fs = require('fs'),
    path = require('path');

function format(string, sep) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, sep || '');
}

var defaults = getDefaults();

gulp.task('default', function(done) {

    // https://www.npmjs.com/package/inquirer
    var prompts = [{
        name: 'appName',
        message: 'What the module name?',
        default: defaults.app
    }, {
        name: 'description',
        message: 'What the description?',
        default: defaults.description
    }, {
        name: 'version',
        message: 'What the module version?',
        default: defaults.version,
        validate: function(input) {
            return /\d\.\d\.\d+/.test(input);
        }
    }, {
        type: 'input',
        name: 'keywords',
        message: 'what the keywords?',
        filter:
            function (value) {
                if (typeof value === 'string') {
                    value = value.split(',');
                }
                return value
                    .map(function (val) {
                        return val.trim();
                    })
                    .filter(function (val) {
                        return val.length > 0;
                    })
            }
    }, {
        name: 'author',
        message: 'What the author name?',
        default: defaults.author
    }, {
        name: 'email',
        message: 'What the author email?',
        default: defaults.email
    }, {
        name: 'githubName',
        message: 'What the github username?',
        default: defaults.author
    }, {
        type: 'list',
        name: 'license',
        message: 'Choose your license type',
        choices: ['MIT', 'BSD'],
        default: 'MIT'
    }];

    //Ask
    inquirer.prompt(prompts,
        function(answers) {
            answers.app = format(answers.appName, "-");
            answers.year = new Date().getFullYear();

            var files = [__dirname + '/templates/**'];

            if (answers.license === 'MIT') {
                files.push('!' + __dirname + '/templates/LICENSE_BSD');
            } else {
                files.push('!' + __dirname + '/templates/LICENSE_MIT');
            }

            gulp.src(files)
                .pipe(template(answers))
                .pipe(rename(function(file) {

                    file.basename = file.basename.replace(new RegExp('appName', 'g'), answers.app);

                    if (answers.license === 'MIT') {
                        var mit = file.basename.replace('LICENSE_MIT', 'LICENSE');
                        file.basename = mit;
                    } else {
                        var bsd = file.basename.replace('LICENSE_BSD', 'LICENSE');
                        file.basename = bsd;
                    }

                    if (file.basename[0] === '_') {
                        file.basename = '.' + file.basename.slice(1);
                    }

                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .pipe(install())
                .on('end', function() {
                    done();
                });
        });
});


// fetch default values
function getDefaults() {
    try {
        var pkg = require(path.join(process.cwd(), 'package.json'));

        return {
            app: pkg.name,
            author: pkg.author.name,
            email: pkg.author.email,
            version: pkg.version,
            description: pkg.description
        }
    }catch(ex) {
        var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
            workingDirName = process.cwd().split('/').pop().split('\\').pop(),
            osUserName = homeDir && homeDir.split('/').pop() || 'root',
            configFile = homeDir + '/.gitconfig',
            user = {};
        if (fs.existsSync(configFile)) {
            user = iniparser.parseSync(configFile).user;
        }
        return {
            app: workingDirName,
            author: format(user.name) || osUserName,
            email: user.email || '',
            version: '0.0.1',
            description: ''
        };
    }
}