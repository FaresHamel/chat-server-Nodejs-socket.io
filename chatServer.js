const express = require('express');
const {createServer} = require('node:http');
const {Server} = require('socket.io');
const app = express();
const {join} = require('node:path');
const fs = require("fs");
const server = createServer(app);

const io = new Server(server, {
    connectionStateRecovery: {},
});
  
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: "mysql-71523b1-fares21elhamel-0ad8.j.aivencloud.com",
  database: "easierjustice",
  port: 16043,
  user: "avnadmin",
  password: "AVNS_IQz6gJc978gUO1YmrEo",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString()
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

io.on('connection', socket => {
    
  console.log('A user connected');
  
  socket.on('get_user_message', (senderId, recievedId) => {
    const query =
      'SELECT * FROM easierjustice.message WHERE ( sender_id = ' +
      senderId +
      ' AND receiver_id = ' +
      recievedId +
      ' ) OR (sender_id = ' +
      recievedId +
      ' AND receiver_id = ' +
      senderId +
      ') ORDER BY sent_at ASC;';
    
    try {
      connection.query(query, (err, rows, fields) => {
        if (err) throw err;
        if (rows.length == 0) {
        socket.emit('users_messages', 0); 
        }
        // console.log(rows)  

        socket.emit('users_messages', rows); 
      });
    } catch (err) {
      return;
    }

  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3100, () => {
  console.log('socket io messagin server in port 3100');
});
