import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

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
