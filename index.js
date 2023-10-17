const mysql = require('mysql2')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'estoque'
});

connection.connect(function(err){
    if(err){
        console.error('Erro: ',err)
        return
    } 
    console.log("Conexão estabelecida com sucesso!")
});

app.get("/estoque", function(req, res){
    res.sendFile(__dirname + "/estoque.html")
})
app.post('/adicionar',(req, res) =>{
    const descricao = req.body.descricao;
    const quantidade_estoque = req.body.quantidade_estoque;
    const valor_unitario = req.body.valor_unitario;
    const peso = req.body.peso;
    const medida = req.body.medida;
    const localizacao_estoque = req.body.localizacao_estoque;

    const values = [descricao, quantidade_estoque, valor_unitario, peso, medida, localizacao_estoque]
    const insert = "INSERT INTO produtos(descricao, quantidade_estoque, valor_unitario, peso, medida, localizacao_estoque) VALUES (?,?,?,?,?,?)"

    connection.query(insert, values, function(err, result){
        if (!err){
            console.log("Dados inseridos com sucesso!");
            res.send("Dados inseridos!");
        } else {
            console.log("Não foi possível inserir os dados ", err);
            res.send("Erro!")
        }
    })

})
app.get("/listar", function(req, res){

    const selectAll = "SELECT * FROM produtos";
   
    connection.query(selectAll, function(err, rows){
        if (!err){
            console.log("Dados inseridos com sucesso!");
            res.send(`
            <html>
                <body>
                    <h1> Relatório de Estoque </h1>
                    <table>
                        <tr>
                            <th> Descrição </th>
                            <th> Quantidade em estoque </th>
                            <th> Valor Unitario </th>
                            <th> Peso </th>
                            <th> Medida </th>
                            <th> Localização no Estoque </th>
                        </tr>
                        ${rows.map(row => `
                        <tr>
                            <td>${row.descricao}</td>
                            <td>${row.quantidade_estoque}</td>
                            <td>${row.valor_unitario}</td>
                            <td>${row.peso}</td>
                            <td>${row.medida}</td>
                            <td>${row.localizacao_estoque}</td>
                        </tr>
                        `).join('')}
                    </table>
                </body>
            </html>
         `);
        } else {
            console.log("Erro no Relatório de Estoque ! ", err);
            res.send("Erro!")
        }
    })
})

app.get("/", function(req,res){
    res.send(`
    <html>
    <head>
        <title>Controle de Estoque</title>
        <link rel="stylesheet" type="text/css"  href="estilo.css">
    </head>
    <body>
    <nav>
        <ul>
            <li>
                <a href="http://127.0.0.1:5500/ControleEstoque.html">Home</a>
            </li>
            <li>
                <a href="http://localhost:8081/estoque">Cadastrar Produto</a>
            </li>
            <li>
                <a href="http://localhost:8081/listar">Relatório de Estoque</a>
            </li>
        </ul>
    </nav>
    </body>
    </html>
    
    `);
});

app.listen(8084, function(){
    console.log("Servidor rodando na url http://localhost:8084")
})