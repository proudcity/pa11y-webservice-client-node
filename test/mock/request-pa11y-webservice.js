'use strict';

var sinon = require('sinon');

module.exports = sinon.spy(function (opts, done) {
	var endpoint = opts.method + ' ' + opts.url;
	if (mockEndpoints[endpoint]) {
		mockEndpoints[endpoint](opts.qs, opts.body, done);
	} else {
		done(null, {statusCode: 404}, {
			code: 404,
			error: 'Not Found',
			message: 'foo'
		});
	}
});

var mockEndpoints = {

	'GET http://pa11y-ws/tasks': function (query, body, done) {
		return done(null, {statusCode: 200}, []);
	},

	'POST http://pa11y-ws/tasks': function (query, body, done) {
		if (body.url && body.standard) {
			return done(null, {statusCode: 201}, {
				id: 'task1',
				url: body.url,
				standard: body.standard,
				ignore: body.ignore || []
			});
		}
		return done(null, {statusCode: 400}, {
			code: 400,
			error: 'Bad Request',
			message: 'foo'
		});
	},

	'GET http://pa11y-ws/tasks/results': function (query, body, done) {
		if (query.foo) {
			return done(null, {statusCode: 400}, {
				code: 400,
				error: 'Bad Request',
				message: 'foo'
			});
		}
		return done(null, {statusCode: 200}, []);
	},

	'GET http://pa11y-ws/tasks/task1': function (query, body, done) {
		return done(null, {statusCode: 200}, mockTask);
	},

	'DELETE http://pa11y-ws/tasks/task1': function (query, body, done) {
		return done(null, {statusCode: 204}, null);
	},

	'GET http://pa11y-ws/tasks/task1/results': function (query, body, done) {
		if (query.foo) {
			return done(null, {statusCode: 400}, {
				code: 400,
				error: 'Bad Request',
				message: 'foo'
			});
		}
		return done(null, {statusCode: 200}, []);
	},

};

var mockTask = {
	id: 'task1',
	url: 'nature.com',
	standard: 'WCAG2AA',
	ignore: []
};