const environments = {};

environments.staging = {
    port: 3001,
    envName: "staging",
    secretKey: 'gsehgfeuwyi'
};

environments.production = {
    port: 5000,
    envName: "production",
    production: 'dghwffdsabhjags',
}

const currentEnv = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : staging;

const envToExport = typeof (environments[currentEnv]) === 'object'
    ? environments[currentEnv]
    : environments.staging;

module.exports = envToExport;