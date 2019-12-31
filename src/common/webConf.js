if(process.env.NODE_ENV == 'production') {
  console.log('现在使用的是生产环境配置');
} else if(process.env.NODE_ENV == 'development') {
  console.log('现在使用的是开发环境配置');
}