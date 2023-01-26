import wikisearch from '../src/functions.js';

const r1 = await wikisearch.getRelated("JavaScript");
const r2 = await wikisearch.getRelated("Python");
const r3 = await wikisearch.getRelated("GitHub");

const s1 = await wikisearch.getSummary("JavaScript");
const s2 = await wikisearch.getSummary("Python");
const s3 = await wikisearch.getSummary("GitHub");

(async () => {

	describe("Result tests", () => {

		it("Related results", () => {
			expect(r1.title=="Not found.").toBeFalsy();
			expect(r2.title=="Not found.").toBeFalsy();
			expect(r3.title=="Not found.").toBeFalsy();
		});

		it("Summary results", () => {
			expect(s1.title=="Not found.").toBeFalsy();
			expect(s2.title=="Not found.").toBeFalsy();
			expect(s3.title=="Not found.").toBeFalsy();
		});

	});

	describe("Copy-pasting tests", () => {

		it("Copying summaries", () => {

			const c1 = (Math.random() + 1).toString(36).substring(2);
			wikisearch.copySummary(c1);
			expect(c1).toMatch(wikisearch.readCopy());

			const c2 = (Math.random() + 1).toString(36).substring(2);
			wikisearch.copySummary(c2);
			expect(c2).toMatch(wikisearch.readCopy());

			const c3 = (Math.random() + 1).toString(36).substring(2);
			wikisearch.copySummary(c3);
			expect(c3).toMatch(wikisearch.readCopy());

		});

	});

	describe("Text function tests", () => {

		it("fixTitles", () => {
			const text = {
				pages: [{title: "java_script_js"}, {title: "py_thon_(disambiguation)"}, {title: "git_hub__"}]
			}
			console.log(wikisearch.fixTitles(text))
			const expected = ["- java script js", "- py thon", "- git hub  "]
			expect(wikisearch.fixTitles(text)).toEqual(expected);
		});

	});

})();

