module.exports = {
    entry: './uri-standard-checker-browser.js',
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};