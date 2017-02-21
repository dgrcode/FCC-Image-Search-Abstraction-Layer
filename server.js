const express = require('express');
const querystring = require('querystring');
const https = require('https');

const app = express();

app.get('/', (req, res) => {
	res.end('Go to "/search/:search query:" to search or' +
			' "/history" to see the latest seraches');
});

const searchUrl = "https://www.googleapis.com/customsearch/v1"; 
const cx = process.env.APICX;
const key = process.env.APIKEY;
const searchType = "image"; // search images
const num = 10; // number of results to return

app.get('/search/:str', (req, res) => {
	// Do the query to the Google API
	const query = {
		cx,
		key,
		searchType,
		q: req.params.str,
		num,
	};

	let offset = parseInt(req.query.offset);
	if (offset) {
		query.start = offset * 10 + 1;
	}

	https.get(searchUrl + '?' + querystring.stringify(query), answer => {
		let rawData = '';
		answer.on('data', chunk => {
			rawData += chunk;
		});
		answer.on('end', () => {
			let parsedData = JSON.parse(rawData);
			let processedData = parsedData.items.map(resultObj => 
				({
					url: resultObj.link,
					snippet: resultObj.snippet,
					thumbnail: resultObj.image.thumbnailLink,
					context: resultObj.image.contextLink
				})
			);
			res.json(processedData);
			res.end();
		});
	})
	.on('error', e => {
		console.log('there was an error:');
		console.log(e);
		res.end();
	});

	// Stores this search in the history
	
});

app.get('/history', (req, res) => {
	console.log('Looking for the history');
	res.end();
});

app.listen(process.env.PORT);
console.log('App listening on port ' + process.env.PORT);