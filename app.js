const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const {get, set} = require('./src/db/redis.js')
const {access}  = require('./src/untils/log.js')


//// session 数据
//const SESSION_DATA = {}

/*
 * 设置 cookie 过期时间
 * */
const getCookieExpires = ()=> {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('s.toGMTTostring is', d.toGMTString())
    return d.toGMTString()
}


// 用于处理post data
const getPostData = (req)=> {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = '';
        req.on('data', chunk=> {
            postData += chunk.toString()
        })
        req.on('end', ()=> {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise;
}


const serverHandle = (req, res) => {
    // 记录
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)


    //  设置返回格式 JSON
    res.setHeader('Content-type', 'application/json;charset=utf-8')

    //const resData = {
    //    env: process.env.NODE_ENV,
    //    name: '佳音',
    //    site: 'imooc2222222222'
    //};
    //
    //res.end(JSON.stringify(resData))
    const url = req.url;
    req.path = url.split('?')[0];

    // 解析query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '' // k1=v1;k2=v2
    cookieStr.split(';').forEach(item=> {
        if (!item) {
            return
        }
        const arr = item.split('=');
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val;
    })
    console.log('cookie', req.cookie)

    // 解析session
    //let needSetCookie = false;
    //let userId = req.cookie.userid;
    //if (userId) {
    //    if (!SESSION_DATA[userId]) {
    //        SESSION_DATA[userId] = {}
    //    }
    //} else {
    //    needSetCookie = true;
    //    userId = `${Date.now()}_${Math.random()}`;
    //    SESSION_DATA[userId] = {}
    //}
    //req.session = SESSION_DATA[userId]

    // 解析session 使用redis
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if(!userId){
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    req.sessionId = userId
    get(req.sessionId).then(sessionData=>{
        if(sessionData === null){
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置session
            req.session = {}
        }else{
            req.session = sessionData;
        }
        console.log('req.session', req.session)
        return getPostData(req)
    }).then(postData=> {
        req.body = postData;
        console.log(typeof req.body, req.body, ')')
        // 处理Blog 路由
        const blogResult = handleBlogRouter(req, res);

        if (blogResult) {
            blogResult.then(blogData=> {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                if (blogData) {
                    res.end(JSON.stringify(blogData))
                }
            })
            return;
        }

        // 处理user路由
        const userResult = handleUserRouter(req, res)
        //if (userData) {
        //    res.end(JSON.stringify(userData))
        //    return;
        //}
        if (userResult) {
            userResult.then(userData=> {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                if (userData) {
                    res.end(JSON.stringify(userData))
                }
            })
            return;
        }
        // 未命中路由
        res.writeHead(404, {"content-type": 'text/plain'})
        res.write("404 Not Found")
        res.end();
    })
}

module.exports = serverHandle;