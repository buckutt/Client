const config = {
    protocol: 'https',
    host    : 'localhost',
    port    : 3000
};

config.baseURL = `${config.protocol}://${config.host}:${config.port}`;

export default config;
