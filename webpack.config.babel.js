import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import locale from './locales/en.json';

class I18nPlugin {
  constructor(options = {}) {
    this.i18n = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      const {
        beforeEmit,
      } = HtmlWebpackPlugin.getHooks(compilation);

      beforeEmit.tapAsync(
        'I18nPlugin',
        (data, cb) => {
          const keys = data.html.match(/({\st\s\')(.+?)(\'\s})/g);

          for (let i = 0; i < keys.length; i++) {
            const key = keys[i].replace(/({\st\s\')(.+?)(\'\s})/, '$2');
            data.html = data.html.replace(keys[i], this.i18n[key] || key);
          }

          cb(null, data)
        }
      );
    });
  }
}

const configuration = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-srcsets-loader',
            options: {
              interpolate: true,
              attrs: ['img:src', ':srcset']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(jpg|png|svg|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 90
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                speed: 11,
                quality: '90-100',
              }
            }
          }
        ]
      },
      {
        test: /\.woff?/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts'
            }
          },
        ]
      },
      {
        test: /\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'sounds'
            }
          },
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './public/assets',
      to: './',
    }]),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new I18nPlugin(locale)
  ]
};

export default (env, argv) => {
  if (argv.mode === 'development') {
    configuration.devtool = 'cheap-module-source-map';
  }

  if (argv.mode === 'production') {
    configuration.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    };
  }

  return configuration;
}
