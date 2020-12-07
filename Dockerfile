FROM node:latest as build-step-sample
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:alpine as prod-stage
COPY --from=build-step-sample /app/dist/SampleShoppingApplication /usr/share/nginx/html
EXPOSE 81