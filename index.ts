#! /usr/bin/env node
const { program } = require("commander");
const wiki = require("wikipedia");

program
	.name("wikisearch")
	.description("A tool to quickly search something on wikipedia.")
	.version("1.0.0", "-v, --version", "Shows the current version.");

program
	.option("-d, --debug", "Debug mode.")
	.requiredOption("-s, --searchword <text...>", "The search word.");

program.parse();

const options = program.opts();
if (options.debug) console.log(options);
let search = '';
let i=0;
for (let word of options.searchword) {
	let added=false;
	if (search=='') {
		search+=word;
		added=true;
	}
	if (!added) {
		search+=' '+word;
	}
}

(async () => {
	try {
		const res = await wiki.summary(search);
		const title = res.title;
		if (title == "Not found.") {
			console.log("\nNo results found.");
			process.exit();
		}
		const description = res.description;
		const summary = res.extract;
		console.log("\nTitle: ", title);
		console.log("------------");
		console.log("Description: ", description ? description : "Not found.");
		console.log("------------");
		console.log("Summary: ", summary ? summary : "Not found.");
	} catch (error) {
		console.log(error);
	}
})();
