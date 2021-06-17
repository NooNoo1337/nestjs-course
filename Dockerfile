# Get base image
FROM node:14-alpine

# Setup workdir
WORKDIR /usr/app

# Install dependencies (exclude devDependencies because of --production flag) and make audit check
COPY package.json .
RUN yarn install --frozen-lockfile --production --audit

# Copy other files
COPY . .
RUN yarn build

CMD ["node", "./dist/main.js"]