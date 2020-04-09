/**
 * Created by 87790 on 2020/3/29.
 */

const {exec} = require('../db/mysql')


const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += ` and author = '${author}' `
    }
    if (keyword) {
        sql += ` and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回 promise
    return exec(sql)
}

const getDetail = (id) => {
    // 先返回假数据 (格式是正确的)
    //return {
    //    id: 1,
    //    title: '标题A',
    //    content: '内容A',
    //    createTime: 1546610491112,
    //    author: 'zhangsan'
    //}
    let sql = `select * from blogs where id='${id}' `
    // 返回 promise
    return exec(sql).then(rows => {
        return rows[0]
    })
}


const newBlog = (blogData = {})=> {
    // blogData 是博客对象包含 title content author 属性
    //console.log('bologData...',typeof blogData,  blogData);
    const {title, content, author} = {...blogData};
    //const title = blogData.title;
    //const content = blogData.content;
    //const author = blogData.author;
    const createtime = Date.now();
    const sql = `
        insert into blogs (title, content, author, createtime)
        values ('${title}', '${content}', '${author}', ${createtime});
     `

    return exec(sql).then(insertData => {
        console.log('insertData is', insertData)
        /*
             fieldCount: 0,
             affectedRows: 1,
             insertId: 10,
             serverStatus: 2,
             warningCount: 0,
             message: '',
             protocol41: true,
             changedRows: 0
         */
        return {
            id: insertData.insertId
        }
    })

    //return {
    //    id: 3 // 表示新建博客 ，插入到数据表里面的 id
    //}
}

const updateBlog = (id, blogData = {})=> {
    // id 要更新blog 的ID
    // blogData 是博客对象包含 title content 属性
    console.log('updateBlog...', id, blogData);
    const {title, content, author} = {...blogData};
    const sql = `
        update blogs set title='${title}', content='${content}' where id = '${id}'
     `
    return exec(sql).then(updateData => {
        console.log('updateData is', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false;
    })
}

const delBlog = (id, author)=> {
    // id 要删除blog 的ID
    console.log('delBlog...', id);

    //const {title, content, author} = {...blogData};
    const sql = `
        delete from blogs where id = '${id}' and author = '${author}';
     `
    console.log(sql, 'blogs')
    return exec(sql).then(delData=>{
        if (delData.affectedRows > 0) {
            return true
        }
        return false;
    })

    //return true;
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}