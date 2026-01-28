FROM nginx:alpine

WORKDIR usr/share/nginx/html/

COPY /templates/ .

RUN tsc main.ts --target ES6 --module ES6

EXPOSE 80