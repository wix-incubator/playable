module.exports = {
  launch: {
    headless: false,
  },
  server: {
    command: 'npm run start -- entry=./test.ts',
    port: 5000,
    launchTimeout: 5000,
  },
};
