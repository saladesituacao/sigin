FROM nginx:stable-alpine
LABEL maintainer="joserobertovasconcelos@gmail.com"

COPY dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
