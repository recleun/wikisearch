const wikisearch = require("./wikisearch");
const opn: typeof open = require("open");
const cp = require("copy-paste");
const colors = require("ansi-colors");
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

async function makeRequest(searchword) {
    const path = `/page/summary/${searchword.replace(/ /g,"_")}`
    try {
        const response = await wikisearch.getSummary(path);
        return response;
    }
    catch (error) {
        console.error(error);
    }
}

(async () => {
    const res = await makeRequest(search);
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
        console.log(colors.green("\nTitle: "), title);
        console.log("------------");
        console.log(colors.green("Description: "), description ? description : "Not found.");
        console.log("------------");
        console.log(colors.green("Summary: "), summary ? summary : "Not found.");
    }
})();
