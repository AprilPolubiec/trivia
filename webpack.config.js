const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(mp3|flac)$/,
        use: ["file-loader"],
      },
    ],
  },
  devServer: {
    contentBase: './public',
    hot: true,
  }
};
