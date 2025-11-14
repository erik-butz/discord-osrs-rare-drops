module.exports = {
  apps: [{
    name: "app",
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
      LOCATION: "non-clan",
      NODE_ENV: "production",
    }
  }]
}