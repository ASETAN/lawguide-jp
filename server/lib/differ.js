const Diff = require('diff');

class Differ {
    /**
     * Compare two texts and return HTML with highlighting
     * @param {string} oldText 
     * @param {string} newText 
     * @returns {string} HTML string
     */
    generateHtmlDiff(oldText, newText) {
        const diff = Diff.diffChars(oldText, newText);
        let html = '';

        diff.forEach((part) => {
            // green for additions, red for deletions
            // grey for common parts
            const color = part.added ? 'bg-green-100 text-green-800' :
                part.removed ? 'bg-red-100 text-red-800 line-through' : 'text-gray-800';

            const span = `<span class="${color}">${part.value}</span>`;
            html += span;
        });

        return html;
    }
}

module.exports = new Differ();
