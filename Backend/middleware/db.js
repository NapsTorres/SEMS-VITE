const { createPool } = require("mysql2");
// const pool = createPool({
//   host: 'sql12.freesqldatabase.com',
//   user: 'sql12755276',
//   password: 'bbqitSdbb6',
//   database: 'sql12755276',
//   port: 3306,
//   connectionLimit: 10,
//   connectTimeout: 120000  // 120 seconds
// });
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sport',
  port: 3306,
  connectionLimit: 10,
  connectTimeout: 120000  // 120 seconds
});


module.exports = pool;
