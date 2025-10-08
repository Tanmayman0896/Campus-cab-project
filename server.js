const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const port = 3000;

// Simple webpack config for React Native Web
const webpackConfig = {
  mode: 'development',
  entry: {
    app: ['./index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-expo']
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    },
    extensions: ['.web.js', '.js', '.json']
  },
  devtool: 'source-map'
};

const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Carpool App</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #000;
          }
          #root {
            height: 100vh;
            width: 100vw;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script src="/app.bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`🚀 Carpool App running at http://localhost:${port}`);
  console.log('📱 Your React Native app is ready!');
});

module.exports = app;
