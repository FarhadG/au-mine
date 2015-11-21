'use strict';

/**
 * Module dependencies
 */

var Undertaker = require('undertaker');
var request = require('superagent');
var should = require('should');
var au = require('../index');
var mocha = require('mocha');
var fs = require('fs');

/**
 * Test server configurations
 */

require('./server/server');
var uri = 'http://localhost:5000';
process.env.ZUUL_PORT = 5000;

describe('au', function() {

  it('should be an instance', function(done) {
    (au instanceof au.Au).should.be.true();
    done();
  });

  it('should extend Undertaker', function(done) {
    (au instanceof Undertaker).should.be.true();
    done();
  });

  describe('constructor', function() {
    it('should be accessible', function(done) {
      (au instanceof au.Au).should.be.true();
      done();
    });
  });

  describe('src', function() {
    it('should be a readable stream', function(done) {
      should.exist(au.src);
      should.equal(au.src, request.get);
      should.exist(au.src(uri + '/ok').pipe);
      done();
    });
  });

  describe('dest', function() {
    it('should be a writeable stream', function(done) {
      should.exist(au.dest);
      should.equal(au.dest, fs.createWriteStream);
      done();
    });
  });
});

