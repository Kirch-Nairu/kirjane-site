# Stage 1: Build static pre-rendered React Router application
FROM node:22.22.0-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && npm run verify:routes

# Stage 2: Serve static artifacts via hardened Nginx
FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/client /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
