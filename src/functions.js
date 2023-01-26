import wiki from 'wikipedia';
import clipboard from 'clipboardy';

const wikisearch = {

	async getRelated(search) {
		try {
		    const res = await wiki.related(search);
			return res;
		} catch (error) {
		    console.error(error);
		}
	},

	async getSummary(search) {
		try {
        	const res = await wiki.summary(search);
	    	return res;
	    } catch (error) {
	        console.error(error);
	    }
	},

	copySummary(text) {
		clipboard.writeSync(text);
	},

	readCopy() {
		return clipboard.readSync();
	},

	fixTitles(resObject) {
		let fixed = [];
		for (let [key, page] of Object.entries(resObject.pages)) {
        	fixed.push('- '+page.title.replace("_(disambiguation)", "").replaceAll("_", " "))
    	}
    	return fixed;
	}
}

export default wikisearch;
