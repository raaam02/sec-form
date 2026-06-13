FROM node:20-alpine AS builder

WORKDIR /app

# Copy lockfiles and workspace package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY packages/db/package*.json ./packages/db/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/validators/package*.json ./packages/validators/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/config/package*.json ./packages/config/

RUN npm ci

# Copy full monorepo source
COPY . .

# Build API package
RUN npx turbo run build --filter=@sec-form/api

EXPOSE 4000

CMD ["npx", "turbo", "run", "start", "--filter=@sec-form/api"]
