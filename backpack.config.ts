module.exports = {
    webpack: (config, options, webpack) => {
        config.entry.main = './server/App.js'
        return config
    }
}