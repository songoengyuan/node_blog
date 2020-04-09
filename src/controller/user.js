/**
 * Created by 87790 on 2020/3/30.
 */
const {exec} = require('../db/mysql')



const logincheck = (username, password)=> {
    console.log(username, password,'============');

    const sql = `
        select username, realname from users where username = '${username}' and password = '${password}'
    `

    return exec(sql).then(rows =>{
        return rows[0] || {}
    })

    //if (username === 'zhangsan' && password === '123') {
    //    return true;
    //}
    //return false
}

module .exports = {
    logincheck
}