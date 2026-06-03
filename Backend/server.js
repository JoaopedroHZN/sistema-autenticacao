//Importando as ferramentas 
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');

//Iniciando o servidor
const app = express();
const PORTA = 3000;

//(Middlewares)
app.use(cors());
app.use(express.json()) // O servidor vai entender dados no formato JSON
