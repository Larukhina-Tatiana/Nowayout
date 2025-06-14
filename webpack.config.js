const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    mode: "development",
    entry: "./src/js/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      clean: true,
    },
    resolve: {
      alias: {
        swiper: path.resolve(__dirname, "node_modules/swiper"),
        "@fonts": path.resolve(__dirname, "src/fonts"),
        "@images": path.resolve(__dirname, "src/assets/images"),
      },
      extensions: [".js", ".json", ".scss", ".css"],
      mainFields: ["browser", "module", "main"],
    },
    module: {
      rules: [
        {
          test: /\.(css|scss)$/i,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                sassOptions: {
                  fiber: false,
                },
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
            // { // Removed svgo-loader for final diagnosis
            //   loader: "svgo-loader",
            //   options: {
            //     plugins: [
            //       {
            //         name: "preset-default",
            //         params: {
            //           overrides: {
            //             removeViewBox: false,
            //             cleanupIDs: {
            //               preservePrefixes: ["clip", "mask", "gradient"],
            //               force: true,
            //             },
            //           },
            //         },
            //       },\n            //     ],
            //   },
            // },
          ],
        },
        // Removed the asset/resource rule for general SVGs. CopyWebpackPlugin will now handle them.
        // {
        //   test: /\.svg$/i,
        //   exclude: path.resolve(__dirname, "src/assets/icons/sprite-icons"),
        //   type: "asset/resource",
        //   generator: {
        //     filename: "assets/icons/[name][ext]",
        //   },
        // },
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
            from: "src/assets/icons/*.svg",
            to: "assets/icons/[name][ext]",
            noErrorOnMissing: true,
            globOptions: {
              ignore: [
                path.resolve(__dirname, "src/assets/icons/sprite-icons/**"),
              ],
            },
          },
          {
            from: "src/assets/logo/logo.svg",
            to: "assets/icons/logo.svg",
            noErrorOnMissing: true,
          },
          {
            from: "src/assets/logo/footer-logo.svg",
            to: "assets/logo/footer-logo.svg",
            noErrorOnMissing: true,
          },
          {
            from: "src/assets/images/rooms/**",
            to: "assets/images/rooms/[name][ext]",
            noErrorOnMissing: true,
          },
        ],
      }),
      new SpriteLoaderPlugin(),
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
    devtool: "source-map",
    devServer: {
      static: "./dist",
      open: true,
    },
  };
};
