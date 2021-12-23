# Stage 1 - the build process
FROM node:12.2.0-alpine AS builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . .
RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.12-alpine
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/default.conf /etc/nginx/conf.d/
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]