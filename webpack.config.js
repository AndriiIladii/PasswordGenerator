const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    open: true,
    port: 3000,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject: "body",
      filename: "index.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
