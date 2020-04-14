/**
 * Created by 87790 on 2020/4/14.
 */

const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

// 读取内容
/*
 fs.readFile(fileName, (err, data) => {
 if (err) {
 console.log(err)
 return;
 }
 console.log(typeof data)
 // data 是二进制类型需转换为字符串类型
 console.log(data.toString())
 })
 */


// 写入文件
/*
 const content = '这是新写入的内容\n'
 const opt = {
 flag: 'a' // 追加写入(append)，覆盖用 ‘W’(write)
 }

 fs.writeFile(fileName, content, opt, (err)=>{
 if(err){
 console.log(err)
 return
 }

 })
 */

// 判断文件是否存在
fs.exists(fileName + '1', (exist)=> {
    console.log('exist', exist) // exist false
})













