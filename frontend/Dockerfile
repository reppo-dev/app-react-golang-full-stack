FROM node:22.18.0 as build
WORKDIR /app
COPY package*.json .
RUN pnpm add
COPY . .
RUN pnpm dev

FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]