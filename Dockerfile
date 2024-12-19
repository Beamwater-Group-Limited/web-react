# 基础镜像
FROM cbtai-hao.tencentcloudcr.com/cbtai/nginx:1.21.6

# 暴露端口 80
EXPOSE 80

# 复制自定义的 Nginx 配置文件
COPY nginx/default.conf /etc/nginx/conf.d/

# 复制静态生成的文件到 Nginx 默认目录
COPY .output/public/ /usr/share/nginx/html/

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
