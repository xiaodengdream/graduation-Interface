let express = require('express')
let User = require('./user')
const setting = require('./set');
const verify = require('./verify');
const { token } = require('./set');
var router = express.Router()
router.get('/', (req, res) => {
  const aaa = {
    name: 'aa',
    id: 5
  }
  res.send(aaa)
})
//员工注册路径
router.post('/register', async (req, res) => {
  let sel = 'SELECT* FROM user where accounts=?'
  await User.query(sel, [req.body.accounts], (err, data) => {
    if (err) {
      console.log(err)
    }
    if (req.body.accounts == '' || req.body.password == '') {
      res.status(200).json({
        code: -1,
        message: '账号或密码为空',
      })
    }
    if (!data[0]) {
      let addsel = 'INSERT INTO user(accounts,password) VALUES(?,?)'
      User.query(addsel, [req.body.accounts, req.body.password], (err, data) => {
        if (err) {
          res.status(500).json({
            code: 500,
            message: 'server err'
          })
          console.log(err)
        }
        else {
          res.status(200).json({
            code: 0,
            message: '注册成功'
          })
        }
      })
    }
    else {
      res.status(200).json({
        code: -1,
        message: '存在该账号',
      })

    }
  })
})
//员工信息注册
router.post('/employee/register', async (req, res) => {
  var sel = 'SELECT* FROM user where accounts=?'
  var addSql = 'INSERT INTO user(accounts,name, professional,email,idcard, telephone, department,posttype,password) VALUES(?,?,?,?,?,?,?,?,?)'
  var addSqlParams = [req.body.accounts, req.body.name, req.body.professional, req.body.email, req.body.idcard, req.body.telephone, req.body.department, req.body.posttype, req.body.password]
  await User.query(sel, [req.body.accounts], (err, data) => {
    if (err) {
      console.log(err)
    }
    if (!data[0]) {
      User.query(addSql, addSqlParams, (err, data) => {
        if (err) {
          res.status(500).json({
            code: 500,
            message: 'server err'
          })
          console.log(err)
        }
        else {
          res.status(200).json({
            code: 0,
            message: '新增员工成功'
          })
        }
      })
    }
    else {
      res.status(200).json({
        code: -1,
        message: '存在该账号',
      })

    }
  })
})
//员工登录路径
router.post('/login', async (req, res) => {
  let sel = 'SELECT* FROM user where accounts=? and password=?'
  await User.query(sel, [req.body.accounts, req.body.password], (err, data) => {
    if (err) {
      console.log(err)
    }
    if (!data[0]) {
      res.status(200).json({
        code: 1,
        message: '账号或者密码错误'
      })
    }
    else {
      verify.setToken(req.body.accounts, req.body.password).then(async (token) => {
        return res.json({
          code: 0,
          message: '恭喜你，欢迎登录',
          data: data,
          token: token,
          signTime: setting.token.signTime
        })
      });

    }
  })
})
//员工信息更新
router.post('/employee/infoUpdate', async (req, res) => {
  var updateSql = 'UPDATE user SET email=?,idcard=?,telephone=? WHERE accounts = ?'
  var updadeSqlParams = [req.body.email, req.body.idcard, req.body.telephone, req.body.accounts]
  await User.query(updateSql, updadeSqlParams, function (err, data) {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '更新成功',
        result: data
      })
    }
  })
})
//员工信息删除根据id
router.post('/employee/infodelete', async (req, res) => {
  var deleteSql = 'DELETE FROM user WHERE id = ?'
  var deleteSqlParams = [req.body.id,]
  await User.query(deleteSql,deleteSqlParams, function (err, data) {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '员工信息删除成功',
        data: data
      })
    }
  })
})
//员工信息全部更新根据id
router.post('/employee/infoUpdates', async (req, res) => {
  var updateSql = 'UPDATE user SET accounts=?,name=?, professional=?,email=?,idcard=?, telephone=?, department=?,posttype=?,password=? WHERE id = ?'
  var updadeSqlParams = [req.body.accounts, req.body.name, req.body.professional, req.body.email, req.body.idcard, req.body.telephone, req.body.department, req.body.posttype, req.body.password,req.body.id]
  await User.query(updateSql, updadeSqlParams, function (err, data) {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '更新成功',
        result: data
      })
    }
  })

})
//根据工号查询员工信息
router.post('/employee/info', async (req, res) => {
  let sel = 'SELECT* FROM user where accounts=?'
  await User.query(sel, [req.body.accounts], (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '单个员工信息',
        data: data,
      })
    }
  })
})
//找回员工密码
router.post('/employee/findps', async (req, res) => {
  let sel = 'SELECT* FROM user where telephone=?'
  await User.query(sel, [req.body.telephone], (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '密码找回成功',
        data: data,
      })
    }
  })
})
//所有员工信息
router.get('/employee/infos', async (req, res) => {
  let sel = 'SELECT* FROM user'
  await User.query(sel, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '所有员工信息',
        data: data,
      })
    }
  })
})
//根据工号查看工资
router.post('/employee/salary', async (req, res) => {
  let sel = 'SELECT* FROM salary where accounts=?'
  await User.query(sel, [req.body.accounts], (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.status(200).json({
        code: 0,
        message: '工资表查询成功',
        data: data
      })
    }
  })
})
//根据id更新工资信息
router.post('/employee/salary/edit', async (req, res) => {
  var updateSql = 'UPDATE salary SET basicSalary=?,senioritySalary=?,postSubsidy=?,postAllowance=?,monthlyBonus=?,endowmentInsurance=?,accumulationFund=?,medicalInsurance=?,unemploymentInsurance=?,transportationSubsidy=?,performanceSalary=?,halfAward=?,annualBonus=? WHERE id = ?'
  var updadeSqlParams = [
    req.body.basicSalary,
    req.body.senioritySalary,
    req.body.postSubsidy,
    req.body.postAllowance,
    req.body.monthlyBonus,
    req.body.endowmentInsurance,
    req.body.accumulationFund,
    req.body.medicalInsurance,
    req.body.unemploymentInsurance,
    req.body.transportationSubsidy,
    req.body.performanceSalary,
    req.body.halfAward,
    req.body.annualBonus,
    req.body.id,]
  await User.query(updateSql, updadeSqlParams, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.status(200).json({
        code: 0,
        message: '工资表更新成功',
        data: data
      })
    }
  })
})
//根据id删除工资信息
router.post('/employee/salary/delete', async (req, res) => {
  var deleteSql = 'DELETE FROM salary WHERE id = ?'
  var deleteSqlParams = [req.body.id,]
  await User.query(deleteSql, deleteSqlParams, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.status(200).json({
        code: 0,
        message: '工资表删除成功',
        data: data
      })
    }
  })
})
//根据id新增工资信息
router.post('/employee/salary/add', async (req, res) => {
  var updateSql = 'INSERT INTO salary (accounts,name,month,basicSalary,senioritySalary,postSubsidy,postAllowance,monthlyBonus,endowmentInsurance,accumulationFund,medicalInsurance,unemploymentInsurance,transportationSubsidy,performanceSalary,halfAward,annualBonus) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  var updadeSqlParams = [
    req.body.accounts,
    req.body.name,
    req.body.month,
    req.body.basicSalary,
    req.body.senioritySalary,
    req.body.postSubsidy,
    req.body.postAllowance,
    req.body.monthlyBonus,
    req.body.endowmentInsurance,
    req.body.accumulationFund,
    req.body.medicalInsurance,
    req.body.unemploymentInsurance,
    req.body.transportationSubsidy,
    req.body.performanceSalary,
    req.body.halfAward,
    req.body.annualBonus]
  await User.query(updateSql, updadeSqlParams, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.status(200).json({
        code: 0,
        message: '工资表更新成功',
        data: data
      })
    }
  })
})
//查看所有工资信息
router.get('/employees/salary', async (req, res) => {
  let sel = 'SELECT* FROM salary'
  await User.query(sel, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.status(200).json({
        code: 0,
        message: '所有工资表查询成功',
        data: data
      })
    }
  })
})
//管理员登录
router.post('/admin', async (req, res) => {
  let sel = 'SELECT* FROM administrators where accounts=? and password=?'
  await User.query(sel, [req.body.accounts, req.body.password], (err, data) => {
    if (err) {
      console.log(err)
    }
    if (!data[0]) {
      res.status(200).json({
        code: 1,
        message: '账号或者密码错误'
      })
    }
    else {
      verify.setToken(req.body.accounts, req.body.password).then(async (token) => {
        return res.json({
          code: 0,
          message: '恭喜你，欢迎登录',
          data: data,
          token: token,
          signTime: setting.token.signTime
        })
      });

    }
  })
})
//根据工号获取管理员信息
router.post('/admin/info', async (req, res) => {
  let sel = 'SELECT* FROM administrators where accounts=?'
  await User.query(sel, [req.body.accounts], (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.status(200).json({
        code: 0,
        message: '管理员信息查询成功',
        data: data
      })
    }
  })
})
//新增管理员信息
router.post('/admin/register', async (req, res) => {
  var sel = 'SELECT* FROM administrators where accounts=?'
  var addSql = 'INSERT INTO administrators (accounts,email,idcard, telephone, department,password) VALUES(?,?,?,?,?,?)'
  var addSqlParams = [req.body.accounts, req.body.email, req.body.idcard, req.body.telephone, req.body.department, req.body.password]
  await User.query(sel, req.body.accounts, (err, data) => {
    if (err) {
      console.log(err)
    }
    if (!data[0]) {
      User.query(addSql, addSqlParams, (err, data) => {
        if (err) {
          res.status(500).json({
            code: 500,
            message: 'server err'
          })
          console.log(err)
        }
        else {
          res.status(200).json({
            code: 0,
            message: '新增一级管理员信息成功',
            data: data,
          })
        }
      })
    }
    else {
      res.status(200).json({
        code: -1,
        message: '存在该账号',
      })

    }
  })
})
//获取所有管理员信息
router.get('/admin/infos', async (req, res) => {
  let sel = 'SELECT* FROM administrators'
  await User.query(sel, (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      res.status(200).json({
        code: 0,
        message: '所有管理员信息查询成功',
        data: data
      })
    }
  })
})
//管理员信息更新
router.post('/admin/infoUpdate', async (req, res) => {
  var updateSql = 'UPDATE administrators SET email=?,idcard = ?,telephone=? WHERE accounts = ?'
  var updadeSqlParams = [req.body.email, req.body.idcard, req.body.telephone, req.body.accounts]
  await User.query(updateSql, updadeSqlParams, function (err, data) {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '更新成功',
        result: data
      })
    }
  })
})
//管理员所有信息更新根据id
router.post('/admin/infoUpdates', async (req, res) => {
  var updateSql = 'UPDATE administrators SET accounts=?,email=?,idcard=?, telephone=?, department=?,password=? WHERE id = ?'
  var updadeSqlParams = [req.body.accounts, req.body.email, req.body.idcard, req.body.telephone, req.body.department, req.body.password,req.body.id]
  await User.query(updateSql, updadeSqlParams, function (err, data) {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '二级管理员全部信息更新成功',
        result: data
      })
    }
  })
})
//管理员信息删除根据id
router.post('/admin/infodelete', async (req, res) => {
  var deleteSql = 'DELETE FROM administrators WHERE id = ?'
  var deleteSqlParams = [req.body.id,]
  await User.query(deleteSql,deleteSqlParams, function (err, data) {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '二级管理员信息删除成功',
        data: data
      })
    }
  })

})
//找回管理员密码
router.post('/admin/findps', async (req, res) => {
  let sel = 'SELECT* FROM administrators where telephone=?'
  await User.query(sel, [req.body.telephone], (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '密码找回成功',
        data: data,
      })
    }
  })
})
//一级管理员登录
router.post('/senior', async (req, res) => {
  let sel = 'SELECT* FROM senior where accounts=? and password=?'
  await User.query(sel, [req.body.accounts, req.body.password], (err, data) => {
    if (err) {
      console.log(err)
    }
    if (!data[0]) {
      res.status(200).json({
        code: 1,
        message: '账号或者密码错误'
      })
    }
    else {
      verify.setToken(req.body.accounts, req.body.password).then(async (token) => {
        return res.json({
          code: 0,
          message: '恭喜你，欢迎登录',
          data: data,
          token: token,
          signTime: setting.token.signTime
        })
      });

    }
  })
})
//根据工号查看一级管理信息
router.post('/seniorinfo', async (req, res) => {
  let sel = 'SELECT* FROM senior where accounts=?'
  await User.query(sel, [req.body.accounts], (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        data: data,
      })
    }
  })
})
//根据工号更新一级管理信息
router.post('/seniorinfo/update', async (req, res) => {
  let sel = 'UPDATE senior SET idcard = ?,telephone=? WHERE accounts = ?'
  await User.query(sel, [req.body.idcard, req.body.telephone, req.body.accounts], (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '更新成功',
        result: data
      })
    }
  })
})
//根据工号找回一级管理密码
router.post('/senior/findps', async (req, res) => {
  let sel = 'SELECT* FROM senior where telephone=?'
  await User.query(sel, [req.body.telephone], (err, data) => {
    if (err) {
      console.log(err)
    }
    else {
      return res.json({
        code: 0,
        message: '密码找回成功',
        data: data,
      })
    }
  })
})

// router.get('/login', async (req, res) => {
//   let data = await verify.getToken(req.headers.authorization);
//   // 有些请求是需要登录状态的 所以验证token
//   // 验证 data.state >>> true Or false
//   data.state ?
//     (res.json({
//       status: 0,
//       msg: '可以访问'
//     })) :
//     (res.json({
//       status: -2,
//       msg: '请登录'
//     }));


// });

// router.get('/api/newdata', async (req, res) => {
//     res.append("Access-Control-Allow-Origin", "*")
//     res.append("Access-Control-Allow-content-type", "*")
//     let result = await axios.get('https://i.snssdk.com/forum/ncov_data/?activeWidget=1&data_type=%5B2%2C4%2C8%5D&src_type=map')
//     //    console.log(result)
//     //    res.json({name:'deng'})
//     res.send(result.data)
// })
module.exports = router