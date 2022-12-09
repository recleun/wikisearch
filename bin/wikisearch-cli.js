import { getSummary, getRelated } from '../index.js';
import { Command } from 'commander';
import clipboard from 'clipboardy';
import chalk from 'chalk';
const green = chalk.greenBright;
const program = new Command();

program
    .name("wikisearch")
    .description("A tool to quickly search something on wikipedia.")
    .version("1.0.0", "-v, --version", "Shows the current version.");

program
    .option("-d, --debug", "Debug mode.")
    .option("-c, --copy", "Copy the summary if there is one.")
    .requiredOption("-s, --searchword <text...>", "The search word.");

program.parse();

const options = program.opts();
if (options.debug) console.log(options);

let title = '';
for (let w of Array(options.searchword.length).keys()) {
	if (w == options.searchword.length) title+=options.searchword[w];
	else title+=options.searchword[w]+' ';
}

const summary = await getSummary(title);
console.log(green('\nTitle: '), summary.title);
console.log('------------');
console.log(green('Description: '), summary.description);
console.log('------------');
console.log(green('Summary:\n\n'), summary.extract);
if (options.copy) clipboard.writeSync(summary.extract);
