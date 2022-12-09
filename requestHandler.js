import fetch from 'node-fetch';

const api_path = 'https://en.wikipedia.org/api/rest_v1'
const options = {
	headers: {
		'User-Agent': 'https://github.com/recleun/wikisearch'
	}
}

export async function getSummary(title) {
	const path = api_path.concat(`/page/summary/${title}`);
	let response;
	try {
		response = await fetch(path, options);
	} catch (error) {
		console.log(error);
	}
	let summary = await response.json();
	if (summary.extract == undefined) summary.extract = 'Summary not found.';
	if (summary.description == undefined) summary.description = 'Description not found.';
	if (summary.title == undefined) summary.title = 'Title not found.';
	return summary;
}

export async function getRelated(title) {
	const path = api_path.concat(`/page/related/${title}`);
	let response;
	try {
		response = await fetch(path, options);
	} catch (error) {
		console.log(error);
	}
	const related = await response.json();
	for (let page of Array(related.pages.length).keys()) {
		related.pages[page].title = related.pages[page].title.replace(/_/g, ' ');
	}
	return related;
}
