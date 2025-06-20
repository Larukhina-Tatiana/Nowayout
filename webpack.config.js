// webpack.config.js
// if (!global.__WEBPACK_CONFIG_LOADED__) {
//   global.__WEBPACK_CONFIG_LOADED__ = true;
//   console.log("📦 webpack.config.js загружен один раз");
// }

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  // mode: "development", // или "production" для финальной сборки
  entry: "./src/js/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "docs"),
    publicPath: "",
    clean: true,
  },
  resolve: {
    alias: {
      "@fonts": path.resolve(__dirname, "src/fonts"),
      "@images": path.resolve(__dirname, "src/assets/images"),
    },
    extensions: [".js", ".json", ".scss", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "../" },
          },
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: { fiber: false },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|ttf|otf|eot)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(png|jpe?g|gif|avif|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext]",
        },
      },
      {
        test: /\.svg$/i,
        include: path.resolve(__dirname, "src/assets/icons/sprite-icons"),
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
              extract: true,
              spriteFilename: "assets/icons/sprite.svg",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles/main.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/assets/favicon",
          to: "assets/favicon",
          noErrorOnMissing: true,
        },
        {
          from: "src/assets/icons",
          to: "assets/icons",
          globOptions: {
            ignore: ["**/sprite-icons/**"],
          },
          noErrorOnMissing: true,
        },
        {
          from: "src/assets/images/rooms/**",
          to: "assets/images/rooms/[name][ext]",
          noErrorOnMissing: true,
        },
        {
          from: "src/assets/images/*.svg",
          to: "assets/images/[name][ext]",
          noErrorOnMissing: true,
        },
      ],
    }),

    new SpriteLoaderPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["imagemin-jpegtran", { progressive: true }],
              ["imagemin-optipng", { optimizationLevel: 5 }],
            ],
          },
        },
        generator: [
          {
            preset: "webp",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-webp"],
            },
            filename: "assets/images/[name][ext]",
          },
          {
            preset: "avif",
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ["imagemin-avif"],
            },
            filename: "assets/images/[name][ext]",
          },
        ],
        test: /\.(jpe?g|png)$/i,
        exclude: /icons|\.svg$/i,
      }),
    ],
  },
  devServer: {
    static: "./docs",
    open: true,
    hot: false, // 💣 отключаем HMR полностью
  },
  devtool: "source-map",
};
