FROM node:22-alpine AS builder
ARG SERVICE_NAME
WORKDIR /app/$SERVICE_NAME
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodeuser -u 1001
RUN chown -R nodeuser:nodejs /app/$SERVICE_NAME
USER nodeuser
EXPOSE 3000
CMD ["npm", "start"]