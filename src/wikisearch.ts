const api_path = "https://en.wikipedia.org/api/rest_v1"
const req_options = {
	headers: {
		"User-Agent": "https://github.com/recelun/wikisearch"
	}
}

async function getSummary(path) {
	const res = await fetch(api_path+path, req_options);
	const data = await res.json();
	return data;
}

module.exports = {
	getSummary
}
