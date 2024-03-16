module.exports = {
  plugins:{
    'postcss-pxtorem': {
      rootValue: 192.0, // 设计稿宽度/10
      exclude:/(node_module)/,//利用正则表达式排除某些文件夹
      propList: ['*'],//是一个存储哪些被转换的属性列表，这里设置为全部
      unitPrecision: 3, //  转换成rem后保留的小数点位数
      selectorBlackList: [], // 有关px的样式将不被转换，这里也支持正则写法
      minPixelValue: 1, // 所有小于3px的样式都不被转换
    }
  }
}
