const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'nextfolio',
  user: 'nextfolio',
  password: 'dev_password_123',
});

async function test() {
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!');

    const res = await client.query('SELECT NOW()');
    console.log('✅ Query result:', res.rows[0]);

    await client.end();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

test();
