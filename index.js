var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
app.use(bodyParser.json());

// CORS

app.use(bodyParser.urlencoded({
    extended: true
}));

// rota default
app.get('/', function (req, res) {
    return res.send({ error: false, message: 'Server is running' })
});

// config conexão
var dbConn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'api-rest'
});

// conexão com database
dbConn.connect(); 

// Retorna todos os usuários
app.get('/users', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Lista de usuário.' });
    });
});

// Retorna o usuário pelo id 
app.get('/user/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'O usuário é: ' });
    });
});
    
// Adiciona um novo usuário
app.post('/user', function (req, res) {
    let user = req.body;
    if (!user) {
        return res.status(400).send({ error: true, message: 'Por favor, providencie um usuário!' });
    }
    dbConn.query("INSERT INTO users SET ?", {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at":user.created_at
    }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Novo usuário criado com sucesso!' });
    });
});

//  Atualiza um usuário pelo id
app.put('/user', function (req, res) {
    let user_id = req.body.user_id;
    let user = req.body.user;
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
    dbConn.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Usuário atualizado com sucesso!' });
    });
});

//  Delete um usuário pelo id
app.delete('/user', function (req, res) {
    let user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Usuário deletado com sucesso!' });
    });
});

const PORT = 3000;
app.listen(3000, () => {
    console.log('Server is running on port:3000');
});