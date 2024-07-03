const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
  const mode = argv.mode

  const backendUrl = mode === 'production'
    ? 'https://rtcchat.fly.dev'
    : 'http://localhost:4000'
  
  const backendWs = mode === 'production'
    ? 'wss://rtcchat.fly.dev'
    : 'ws://localhost:4000'
  
  return {
    entry: {
      'main': './src/Index.tsx',
      'service-worker': './src/sw.ts'
    },
    devtool: (mode === 'production') ? false : 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {        
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|wav|mp3)$/i,
          use: 'file-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js'
    },
    devServer: {
      static: './build',
      compress: true,
      port: 3000,
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backendUrl)
      }),
      new webpack.DefinePlugin({
        BACKEND_WS: JSON.stringify(backendWs)
      }),
      new webpack.DefinePlugin({
        MODE: JSON.stringify(mode)
      }),
    ],
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  }
}

module.exports = config