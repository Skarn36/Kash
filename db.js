import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: "3306",
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false},
        }
    }
);

db.authenticate().then(function(){
    console.log("Conectado ao banco de dados com sucesso")
}).catch(function(erro){
    console.log("Erro ao conectar com o banco de dados " + erro);
});

export default db;