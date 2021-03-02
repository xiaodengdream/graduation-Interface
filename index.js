let express = require('express')
let axios = require('axios')
let bodyParser = require('body-parser')
let router = require('./router.js')
const expressJWT = require('express-jwt');
const setting = require('./set');
const verify = require('./verify');

let app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())//配置post请求中的bodyParser，可以直接使用req.body-req.query
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  
  next();
});

// app.use(expressJWT({
//   secret: setting.token.signKey // 签名的密钥 或 PublicKey
// }).unless({ // 设置并规定哪些路由不用验证 token
//   path: ['/login'] // 指定路径不经过 Token 解析
// }));


//当token失效返回提示信息 时间过期了执行这一条
app.use((err, req, res, next) => {
    // console.log(req);
  if (err.status === 401) {
    return res.json({
      status: err.status,
      msg: 'token失效',
      error: err.name + ':' + err.message
    })
  }
});

app.use(router)



app.listen('1000', function () {
  console.log('1000 is run')
})