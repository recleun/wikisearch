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

    let res;
    try {
        res = await wiki.related(search);
        if (options.debug == "2") console.log(res);
    } catch (error) {
        console.error(error);
    }
    
    for (let [key, page] of Object.entries(res.pages)) {
        console.log('- '+page.title.replace("_(disambiguation)", "").replaceAll("_", " "))
    }

} else {

    let res;
    try {
        res = await wiki.summary(search);
        if (options.debug == "2") console.log(res);
    } catch (error) {
        console.error(error);
    }

    const type = res.type;
    const title = res.title;
    const summary = res.extract;
    if (options.copy) {
        clipboard.writeSync(summary);
    }

    if (!title || title == "Not found.") {
        console.log(chalk.yellow("No results found."));
    } else if (title != "Not found." && options.browser) {
        await open(res.content_urls.desktop.page);
    } else if (type == "disambiguation") {
        console.log(chalk.italic.yellow("Result is ambiguous, try the following:\n"));
        console.log(chalk.italic(`Open it in the browser by using:\n    wikisearch -s ${search} -b\n`));
        console.log(chalk.italic(`Or see the related pages by using:\n    wikisearch -s ${search} -r`))
    } else {
        const description = res.description;
        console.log(chalk.italic.green("Title: "), title);
        console.log("------------");
        console.log(chalk.italic.green("Description: "), description ? description : "Not found.");
        console.log("------------");
        console.log(chalk.italic.green("Summary: "), summary ? summary : "Not found.");
    }
}
