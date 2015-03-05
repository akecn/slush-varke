/*
 * slush-varke
 * https://github.com/akecn/slush-varke
 *
 * Copyright (c) 2014, wuake
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');

gulp.task('default', require('./lib/init'));

// npm publish. fetch module version and update, then publish
gulp.task('version', require('./lib/version'));