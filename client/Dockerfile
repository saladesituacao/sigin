FROM nginx:stable-alpine
LABEL maintainer="joserobertovasconcelos@gmail.com"

COPY dist /usr/share/nginx/html

ENV URL_REST "http://exemplo.com"
ENV CONTEXT_REST "/api"
ENV URL_AUTH ""
ENV ID_APP 1

EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
CMD printenv|while IFS='=' read -r name value ; do sed -i -e "s#$name#$value#g" /usr/share/nginx/html/main.bundle.js; done && nginx -g 'daemon off;'
