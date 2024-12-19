# 基础镜像
FROM cbtai-hao.tencentcloudcr.com/cbtai/nginx:1.21.6
EXPOSE 80
COPY nginx/default.conf /etc/nginx/conf.d/
COPY dist/ /usr/share/nginx/html/