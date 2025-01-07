FROM node:20.17-alpine3.19 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
COPY ./.husky ./.husky
RUN npm ci

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
COPY ./.husky ./.husky
ADD package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY ./.husky ./.husky
ADD . .
RUN node ace build

# Production stage
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY ./.husky ./.husky
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]
