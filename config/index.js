const envs = require.context('./', false, /\.json$/);

const config = envs(`./${process.env.NODE_ENV || 'production'}.json`);

export default config;
