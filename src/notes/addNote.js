'use strict';

const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const ULID = require('ulid');

const addNote = async (event) => {
	const { note } = JSON.parse(event.body);
	const createdAt = new Date();
	const id = ULID.ulid();

	let startDate = new Date();
	const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });

	const input = {
		TableName: 'notes',
		Item: {
			id: { S: id },
			note: { S: note },
			createdAt: { S: createdAt },
		},
	};

	try {
		await dynamoClient.send(new PutItemCommand(input));
	} catch (err) {
		console.log(err);
	}

	const newItem = {
		id: { S: id },
		note: { S: note },
		createdAt: { S: createdAt },
	};

	let endDate = new Date();

	let excecutionTimeInSeconds =
		(endDate.getTime() - startDate.getTime()) / 1000;
	console.log(`Execution time: ${excecutionTimeInSeconds} seconds`);

	return {
		statusCode: 200,
		body: JSON.stringify(newItem),
	};
};

module.exports = addNote;
