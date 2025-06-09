const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  devServer: {
    static: "./dist",
    port: 8085,
    open: true,
    hot: true,
    proxy: [
      {
        context: ["/api"],
        target: "https://backend-mediface.vercel.app",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/api": "/api" },
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.json$/,
        type: "javascript/auto",
        use: [
          {
            loader: "json-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      title: "Sistem Manajemen Pasien Rumah Sakit",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "src/assets", to: "assets", noErrorOnMissing: true }],
    }),
  ],
};
