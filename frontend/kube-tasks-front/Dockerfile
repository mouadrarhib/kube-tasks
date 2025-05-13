# Stage 1: Build the Angular app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve with NGINX
FROM nginx:alpine

COPY --from=builder /app/dist/demo/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
