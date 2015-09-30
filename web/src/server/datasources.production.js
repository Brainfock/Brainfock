module.exports = {
  db: {
    connector: 'mysql',
    host: process.env.DB_HOST || '178.62.249.90',
    port: process.env.DB_PORT || 0,
    user: process.env.DB_USER || 'brainfock',
    password: process.env.DB_PASSWORD || 'password',
    database: 'non-existing',
  }
};