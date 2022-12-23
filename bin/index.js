#! /usr/bin/env node
import clipboard from 'clipboardy';
import open from 'open';
import chalk from 'chalk';
import { program } from 'commander';
import wiki from 'wikipedia';

program
    .name("wikisearch")
    .description("A tool to quickly search something on wikipedia.")
    .version("1.1.5", "-v, --version", "Shows the current version.");

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
    let added = false;
    if (search == '') {
        search += word;
        added = true;
    }
    if (!added) {
        search += ' ' + word;
    }
}

let res;
try {
    res = await wiki.summary(search);
} catch (error) {
    console.error(error);
}

const title = res.title;
const summary = res.extract;
if (options.copy) {
    clipboard.writeSync(summary);
}
if (!title || title == "Not found.") {
    console.log("\nNo results found.");
}
else if (title != "Not found." && options.browser) {
    setTimeout(process.exit, 10 * 1000);
    await open(res.content_urls.desktop.page);
}
else {
    const description = res.description;
    console.log(chalk.green("\nTitle: "), title);
    console.log("------------");
    console.log(chalk.green("Description: "), description ? description : "Not found.");
    console.log("------------");
    console.log(chalk.green("Summary: "), summary ? summary : "Not found.");
}
