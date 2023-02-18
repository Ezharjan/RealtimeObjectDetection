// add new package with docker-compose exec web npm install --save pkg_name

const path = require("path");

module.exports = {
  watch: true,
  watchOptions: {
    poll: true,
  },
  entry: "./js-src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "static/js"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    fallback: { crypto: false },
  },
};
