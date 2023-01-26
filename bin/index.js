#! /usr/bin/env node
import wikisearch from '../src/functions.js';
import open from 'open';
import chalk from 'chalk';
import { program } from 'commander';

program
    .name("wikisearch")
    .description("A tool to quickly search something on wikipedia.")
    .version("1.3.0", "-v, --version", "Shows the current version.");

program
    .option("-d, --debug <level>", "Debug mode.", "0")
    .option("-b, --browser", "Open the summary in your browser.")
    .option("-c, --copy", "Copy the summary if there is one.")
    .option("-r, --related", "Search for related summaries with the search word.")
    .requiredOption("-s, --searchword <text...>", "The search word.");

program.parse();
const options = program.opts();
if (options.debug != "0") console.log(options);
process.stdout.write("\n");

let search = '';
for (let word of options.searchword) {
    let added = false;
    if (search == '') {
        search += word;
        added = true;
    }
    if (!added) {
        search += ' ' + word;
    }
}

if (options.related) {

    const related = await wikisearch.getRelated(search);
    for (let [key, page] of Object.entries(related.pages)) {
        console.log(page.title);
    }

} else {

    const summary = await wikisearch.getSummary(search);
    if (options.debug == "2") { console.log(summary); console.log("") };

    if (options.copy) {
        wikisearch.copySummary(summary.extract);
    }

    if (!summary.title || summary.title == "Not found.") {
        console.log(chalk.yellow("No results found."));
    } else if (summary.title != "Not found." && options.browser) {
        await open(summary.content_urls.desktop.page);
    } else if (summary.type == "disambiguation") {
        console.log(chalk.italic.yellow("Result is ambiguous, try the following:\n"));
        console.log(chalk.italic(`Open it in the browser by using:\n    wikisearch -s ${search} -b\n`));
        console.log(chalk.italic(`Or see the related pages by using:\n    wikisearch -s ${search} -r`))
    } else {
        const description = summary.description;
        console.log(chalk.italic.green("Title: "), summary.title);
        console.log("------------");
        console.log(chalk.italic.green("Description: "), description ? summary.description : "Not found.");
        console.log("------------");
        console.log(chalk.italic.green("Summary: "), summary ? summary.extract : "Not found.");
    }
}
