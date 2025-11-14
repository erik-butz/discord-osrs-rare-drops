module.exports = {
  apps: [{
    name: "clan-bot",
    script: "./index.js",
    watch: true,
    env: {
      NODE_ENV: "development"
    },
    env_test: {
      NODE_ENV: "test",
    },
    env_staging: {
      NODE_ENV: "staging",
    },
    env_production: {
      LOCATION: "clan",
      NODE_ENV: "production",
    }
  }]
}