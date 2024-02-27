const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/index.tsx",
  devtool: isDev ? "inline-source-map" : "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    open: true,
    port: 8000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[id].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "NBA Schedule",
      templateContent: `
    <html>
      <body>
        <div id="app"></div>
      </body>
    </html>
  `,
    }),
    new MiniCssExtractPlugin(),
  ],
};
