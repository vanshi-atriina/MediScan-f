# Step 1: Install dependencies and build the app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies based on the lock file
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the code and build the Next.js app
COPY . .
RUN npm run build

# Step 2: Run the app with a lightweight server
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
