FROM oven/bun:latest as build

WORKDIR /app
COPY . /app

ARG VITE_HOST_API
ENV VITE_HOST_API=$VITE_HOST_API

RUN bun install
RUN bun run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]