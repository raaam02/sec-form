FROM node:20-alpine AS builder

WORKDIR /app

# Copy lockfiles and workspace package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/api/package*.json ./apps/api/
COPY packages/db/package*.json ./packages/db/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/validators/package*.json ./packages/validators/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/config/package*.json ./packages/config/

RUN npm ci

# Copy full monorepo source
COPY . .

# Set environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build web client
RUN npx turbo run build --filter=@sec-form/web

EXPOSE 3000

CMD ["npx", "turbo", "run", "start", "--filter=@sec-form/web"]
