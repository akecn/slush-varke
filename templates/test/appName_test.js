/*global describe:true, it:true*/
/*
 * <%= app %>
 * https://github.com/<%= githubName %>/<%= app %>
 *
 * Copyright (c) 2014 <%= author %>
 * Licensed under the <%= license %> license.
 */

'use strict';

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
