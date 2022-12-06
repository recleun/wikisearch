#! /usr/bin/env node
type wikiSummary = import("./node_modules/wikipedia/dist/resultTypes").wikiSummary;
const opn: typeof open = require("open");
const cp = require("copy-paste");
const { program } = require("commander");
const wiki = require("wikipedia");

program
	.name("wikisearch")
	.description("A tool to quickly search something on wikipedia.")
	.version("1.0.0", "-v, --version", "Shows the current version.");

program
	.option("-d, --debug", "Debug mode.")
	.option("-b, --browser", "Open the summary in your browser.")
    .option("-c, --copy", "Copy the summary if there is one.")
	.requiredOption("-s, --searchword <text...>", "The search word.");

program.parse();

const options = program.opts();
if (options.debug) console.log(options);
let search = '';
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

async function getSummary(searchword) {
    try {
        const response: wikiSummary = await wiki.summary(searchword);
        return response;
    }
    catch (error) {
        console.error(error);
    }
}

(async () => {
    const res = await getSummary(search);
    const title = res.title;
    const summary = res.extract;
    if (options.copy) {
        cp.copy(summary);
    }
    if (!title || title == "Not found.") {
        console.log("\nNo results found.");
    }
    else if (title != "Not found." && options.browser) {
        setTimeout(process.exit, 10 * 1000);
        await opn(res.content_urls.desktop.page);
    }
    else {
        const description = res.description;
        console.log("\nTitle: ", title);
        console.log("------------");
        console.log("Description: ", description ? description : "Not found.");
        console.log("------------");
        console.log("Summary: ", summary ? summary : "Not found.");
    }
})();
