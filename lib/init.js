var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    iniparser = require('iniparser'),
    inquirer = require('inquirer'),
    fs = require('fs'),
    path = require('path');

module.exports = initialize;

var defaults = getDefaults();

function initialize(done) {

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
        default: function(answers) {
            return answers.author || defaults.author;
        }
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

            var files = [relativePath('templates/**')];

            switch(answers.license) {
                case 'MIT':
                    files.push('!' + relativePath('/templates/LICENSE_BSD'));
                    break;
                case "BSD":
                    files.push('!' + relativePath('/templates/LICENSE_MIT'));
                    break;
            }

            gulp.src(files)
                .pipe(template(answers))
                .pipe(rename(function(file) {

                    file.basename = file.basename.replace(new RegExp('appName', 'g'), answers.app);

                    if(file.basename.indexOf('LICENSE_') === 0) {
                        file.basename = file.basename.replace("_" + answers.license, "");
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
}

function relativePath(p) {
    return path.join(__dirname, '..', p);
}

function format(string, sep) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, sep || '');
}


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