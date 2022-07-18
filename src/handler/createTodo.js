'use strict';
const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.createTodo = (event, context, callback) => {
	const datetime = new Date().toISOString();
	const data = JSON.parse(event.body);

	if (typeof data.task !== 'string') {
		console.error('Task is not a string');
		const response = {
			statusCode: 400,
			body: JSON.stringify({
				error: 'Task is not a string',
			}),
		};
	}
	const params = {
		TableName: 'todos',
		item: {
			id: uuid.v1(),
			task: data.task,
			done: false,
			createdAt: datetime,
			updatedAt: datetime,
		},
	};
	dynamodb.put(params, (err, data) => {
		if (err) {
			console.error(err);
			callback(null, {
				statusCode: err.statusCode || 501,
				headers: { 'Content-Type': 'text/plain' },
				body: "Couldn't create the todo item.",
			});
			return;
		}
		const response = {
			statusCode: 200,
			body: JSON.stringify(params.item),
		};

		callback(null, response);
	});
};
