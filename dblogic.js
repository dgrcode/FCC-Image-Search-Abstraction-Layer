const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const dbUrl = process.env.MONGOLAB_URI;

const api = {};

api.saveSearch = term => {
	MongoClient.connect(dbUrl)
	.then(db => {
		let collection = db.collection('image-search');

		let searchObject = {term, when: new Date()};

		collection.insertOne(searchObject)
		.then(() => db.close())
		.catch(err => {
			console.log('Error writing on the database.');
			console.log(err);
			db.close();
		});

	})
	.catch(err => {
		console.log('There was an error connecting to the database.');
		console.log(err);
	});
};

api.getHistory = () => new Promise((resolve, reject) => {
	MongoClient.connect(dbUrl)
	.then(db => {
		let collection = db.collection('image-search');

		collection.find({}, {_id: 0, term:1, when:1}).sort({_id: -1}).limit(10).toArray()
		.then(docs => {
			db.close();
			resolve(docs);
		})
		.catch(err => {
			console.log('Error reading from the database.');
			console.log(err);
			reject(err);
		});

	})
	.catch(err => {
		console.log('There was an error connecting to the database.');
		console.log(err);
		reject(err);
	});

});

module.exports = api;