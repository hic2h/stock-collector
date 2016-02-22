'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('POST /api/stock', function() {

  it('should respond with JSON object', function(done) {
    request(app)
      .post('/api/stock')
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /api/stock/mostOperated', function() {

    it('should respond with JSON object', function(done) {
        request(app)
            .get('/api/stock/mostOperated')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('stock');
                done();
            });
    });
});

describe('GET /api/stock/mostActiveUser', function() {

    it('should respond with JSON object', function(done) {
        request(app)
            .get('/api/stock/mostActiveUser')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('success');
                done();
            });
    });
});

describe('GET /api/stock/mostExpensiveStock', function() {

    it('should respond with JSON object', function(done) {
        request(app)
            .get('/api/stock/mostExpensiveStock')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('success');
                done();
            });
    });
});

describe('POST /api/stock/meanAndMedian', function() {

    it('should respond with JSON object', function(done) {
        request(app)
            .post('/api/stock/meanAndMedian')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('success');
                done();
            });
    });
});