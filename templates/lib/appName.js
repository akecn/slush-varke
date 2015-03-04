/**
 * <%= app %>
 * @file <%= description %>
 * https://github.com/<%= githubName %>/<%= app %>
 *
 * Copyright (c) 2014 <%= author %>
 * Licensed under the <%= license %> license.
 */

'use strict';

/**
 * Method responsible for say Hello
 *
 * @example
 *
 *     <%= app %>.awesome('varke');
 *
 * @method awesome
 * @param {String} name Name of People
 * @return {String} Returns hello name
 */
exports.awesome = function (name) {
    return 'hello ' + name;
};
