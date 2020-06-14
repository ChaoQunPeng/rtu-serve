

const mysql = require('mysql');
// const { MYSQL_CONF } = require('../config/db');

const MYSQL_CONF = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'rtu'
};

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF);
con.connect();

// 开始连接


function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
  return promise;
}

module.exports = {
  exec
}