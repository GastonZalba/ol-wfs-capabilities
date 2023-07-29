module.exports = {
    testEnvironment: "jsdom",
    verbose: true,
    transformIgnorePatterns: [
        'node_modules/(?!(ol)/)'
    ],
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    }
}