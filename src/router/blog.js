/**
 * Created by 87790 on 2020/3/29.
 */
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
    } = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')


// 统一的登陆验证函数
const loginCheck = (req)=> {
    if(!req.session.username){
        return Promise.resolve(new ErrorModel({}, '尚未登錄'))
    }
}





const handleBlogRouter = (req, res) => {
    const method = req.method // get post
    const id = req.query.id;
    //const url = req.url;
    //const path = url.split('?')[0];


    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData, '这是获取blog列表的接口')
        })
        //return new SuccessModel(listData, '这是获取blog列表的接口')
    }

    // 获取博客的详情
    if (method === "GET" && req.path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data, '这是获取blog详情的接口')
        })
        //return new SuccessModel(data, '这是获取blog详情的接口')
    }

    if (method === "POST" && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req);
        // 未登录
        if(loginCheckResult){
            return loginCheck;
        }

        req.body.author = req.session.username // todo 假数据 登陆时修改为真数据
        console.log(req.body)
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data, '这是创建blog的接口')
        })
        //return new SuccessModel(data);
    }

    if (method === "POST" && req.path === '/api/blog/update') {
        const result = updateBlog(id, req.body)
        const loginCheckResult = loginCheck(req);
        // 未登录
        if(loginCheckResult){
            return loginCheck;
        }
        return result.then(val=>{
            console.log(val,'------------------------------')
            return val ? new SuccessModel({id}, '更新成功') : new ErrorModel({id},'更新失败')
        })
    }

    if (method === "POST" && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req);
        // 未登录
        if(loginCheckResult){
            return loginCheck;
        }
        const author = req.session.username; // todo 假数据 开发登录时修改为真数据
        const result = delBlog(id, author);
        return result.then(val=> {
            return val ? new SuccessModel({id}, '删除成功') : new ErrorModel({id}, '删除失败')
        })
    }

};


module.exports = handleBlogRouter;