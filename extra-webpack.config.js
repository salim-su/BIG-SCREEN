module.exports = {
  module: {
    rules: [
      {
        test:/\.scss$/,
        use: [
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test:/\.css$/,
        use:['postcss-loader']
      },
      {
        test:/\.less$/,
        use:[
          'postcss-loader',{
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  }
}
