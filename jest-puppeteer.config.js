module.exports = {
  launch: {
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'],
  },
  server: {
    command: 'npm run start -- entry=./test.ts',
    port: 5000,
    launchTimeout: 10000,
  },
};
