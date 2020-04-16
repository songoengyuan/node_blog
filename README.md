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




