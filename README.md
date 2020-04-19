# node_blog



# nginx 介绍

- 高性能的web服务器，开源免费
- 一般用于做静态服务/负载均衡
- 反向代理

### nginx 配置
- windows: C:\nginx\conf\nginx.conf
- Mac: /usr/local/etc/nginx/nginx.conf

### nginx 命令
- 测试配置文件格式是否正确 nginx -t
- 启动nginx: 重启 nignx -s reload

# 7-3 stream 的介绍
### IO 操作的性能瓶颈
- IO包括“网络IO”和“文件IO”
- 相比于CPU计算和内存读写，IO的突出特点就是：慢！
- 如何在有限的硬件资源下提高IO的操作效率

```
// 标准输入输出，pipe 就是管道(符合水流管道的模型图）
// process.stdin 获取数据，直接通过管道传递给 process.stdout
process.stdin.pipe(process.stdout)
```
## 日志拆分
- 日志内容会慢慢积累，放在一个文件中不好处理
- 按时间划分日志文件，如 2019-02-10.access.log
- 实现方式：linux的crontab 命令，即定时任务

#### Linux crontab 命令
- 设置定时任务，格式： *****command
    ```

        *    *    *    *    *
        -    -    -    -    -
        |    |    |    |    |
        |    |    |    |    +----- 星期中星期几 (0 - 7) (星期天 为0)
        |    |    |    +---------- 月份 (1 - 12)
        |    |    +--------------- 一个月中的第几天 (1 - 31)
        |    +-------------------- 小时 (0 - 23)
        +------------------------- 分钟 (0 - 59)
    ```
- 将access.log 拷贝并重命名为2019-02-10.access.log
- 清空access.log文件，继续积累日志
```
#!/bin/sh

cd D:/workspace/node_blog/logs
ls
cp access.log $(date +%Y-%m-%d-%H).access.log
echo "" > access.log
```
## 日志分析
- 如针对access.log日志，分析chrome的占比
- 日志是按行存储，一行日志就是一条之日志
- 使用node.js 的readline(基于stream，效率高)

#### 日志总结
- 日志对server端的重要性，相当于人的眼睛
- IO性能瓶颈，使用stream提高性能，nodejs 中如何操作
- 使用crontab 拆分日志文件，使用readline 分析日志内容

## 8-1 安全
- 安全
    - sql注入:窃取数据库内容
    - XSS攻击：窃取前端的cookie 内容
    - 密码加密：保障用户信息安全
- 攻击方式
    - server 端的攻击非常多，预防手段也非常多
    - 有些攻击需要硬件和服务来支持（需要OP支持），如DDOS
- sql 注入
    - 最原始、最简单的攻击，从web2.0就有了式全力攻击
    - 攻击方式：输入一个sql片段，最终拼接成一段攻击代码
    - 预防措施：使用mysql的escape函数处理输入内容即可
    ```
        const mysql = require("mysql")
        mysql.escape
    ```
- XSS攻击
    - 攻击方式：在页面展示内容中掺杂js代码，以获取网页信息
    - 预防措施：转换生成js的特殊字符
    ```
        npm i xss --save

        const xss = require("xss")

    ```
- 密码加密
    - 万一数据库被攻破，最不应该泄露的就是用户信息
    - 攻击方式：获取用户名和密码，再去尝试登陆其他系统
    - 预防措施：将密码加密，即便拿到密码也不知道明文




