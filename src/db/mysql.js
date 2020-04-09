/**
 * Created by 87790 on 2020/3/26.
 */
const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db.js')

console.log(MYSQL_CONF)

const con = mysql.createConnection(MYSQL_CONF);

// 开始连接
con.connect();

// 统一执行 sql 的函数
let exec = (sql)=> {
    console.log(sql)
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                reject(err)
                return;
            }
            resolve(result)
        })
    })
    return promise;
}

 //con.end(); // 不能定义完上面的函数就关闭

module.exports = {
    exec
}