# =========================
# Stage 1: Build React app
# =========================
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first
COPY package*.json ./

RUN npm ci

# Copy source code
COPY . .

# Build production files
RUN npm run build


# =========================
# Stage 2: Nginx
# =========================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy React production build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]