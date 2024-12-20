rm -rf node_modules
npm ci
npm run build
rm -rf node_modules
npm ci --omit=dev