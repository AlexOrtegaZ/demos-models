const { Client } = require('pg');

function createPgClient() {
  return new Client({ ssl: { rejectUnauthorized: false } });
}

module.exports = createPgClient;