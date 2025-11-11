# Stage 1: Build the Angular application
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application from a lightweight Nginx server
FROM nginx:alpine

# Copy the built artifacts from the build stage
COPY --from=build /app/dist/coreui-free-angular-admin-template/browser/ /usr/share/nginx/html

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
