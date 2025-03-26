FROM node:18-alpine

# Set working directory to monorepo root
WORKDIR /app
ENV TAILWIND_DISABLE_NATIVE=true

# Install pnpm
RUN npm install -g pnpm

# Set env to avoid oxide-native build issues (Tailwind)

# Copy full monorepo context
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client only for backend
RUN pnpm --filter backend exec prisma generate

# Build all apps (handled by Turbo)
RUN pnpm run build

# Expose frontend and backend ports
EXPOSE 3000
EXPOSE 4000

# Start all apps
CMD ["pnpm", "run", "start"]
