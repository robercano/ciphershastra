module.exports = {
    arrowParens: "avoid",
    bracketSpacing: true,
    endOfLine: "auto",
    printWidth: 120,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "all",
    plugins: [require.resolve("prettier-plugin-solidity")],
};
