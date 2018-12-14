module.exports = {
  db: {
    connector: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 0,
    user: process.env.DB_USER || 'brainfock',
    password: process.env.DB_PASSWORD || 'password',
    database: 'brainfock_node',
  }
};