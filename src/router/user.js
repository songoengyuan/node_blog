/**
 * Created by 87790 on 2020/3/29.
 */
const {
    logincheck
    } = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {get, set} = require('../db/redis')


/*
 * 设置 cookie 过期时间
 * */
const getCookieExpires = ()=> {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('s.toGMTTostring is', d.toGMTString())
    return d.toGMTString()
}


const handleUserRouter = (req, res) => {
    const method = req.method // get post
    //const url = req.url;
    //const path = url.split('?')[0];

    // 登录
    if (method === 'GET' && req.path === '/api/user/login') {
        //const {username, password} = req.body;
        const {username, password} = req.query;
        const result = logincheck(username, password);

        return result.then(data=> {
            if (data.username) {
                // 設置session
                req.session.username = data.username;
                req.session.realname = data.realname;

                // 同步到redis 中
                set(req.sessionId, req.session)

                console.log('req.session is', req.session)
                // 操作cookie
                //res.setHeader('Set-Cookie', `username=${data.username};path=/;httpOnly;expires=${getCookieExpires()}`)
                return new SuccessModel({}, '登录成功');
            }
            return new ErrorModel(data, '登录失败');
        })

        //if (result) {
        //    return new SuccessModel(result, '登录成功');
        //} else {
        //    return new ErrorModel(result, '登录失败');
        //}
    }
    //if (method === 'GET' && req.path === '/api/user/login-test') {
    //    //if (req.cookie.username) {
    //    console.log('/api/user/login-test',req.session )
    //    if (req.session.username) {
    //        return Promise.resolve(new SuccessModel({
    //            session: req.session
    //        }, '登录成功'))
    //    }
    //    return Promise.resolve(new ErrorModel({}, '尚未登錄'))
    //}
};


module.exports = handleUserRouter;