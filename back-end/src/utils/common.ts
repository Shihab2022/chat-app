export const parseHtml = (html: string, translations: { [x: string]: any; }) => {
    try {
        var chunks = html.split(/({{[a-z.]+}})/g);
        var chunksTranslated = chunks.map(function (chunk) {
            if (chunk.slice(0, 2) === "{{" && chunk.slice(-2) === "}}") {
                var id = chunk.slice(2, -2);
                return translations[id];
            }
            return chunk;
        });
        return chunksTranslated.join("");
    } catch (error) {
        // return template;
        console.log({ error })
    }
};