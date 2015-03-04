/*global describe:true, it:true*/
'use strict';
/*
 * <%= app %>
 * https://github.com/<%= githubName %>/<%= app %>
 *
 * Copyright (c) <%= year %> <%= author %>
 * Licensed under the <%= license %> license.
 */

var chai = require('chai');
chai.expect();
chai.should();

var <%= app %> = require('../lib/<%= app %>.js');

describe('<%= app %> module', function(){
    describe('#awesome()', function(){
        it('should return a hello', function(){
            <%= app %>.awesome('varke').should.equal("hello varke");
        });
    });
});
