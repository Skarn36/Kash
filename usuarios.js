import db from "./db.js";
import { Sequelize } from "sequelize";

const Usuarios = db.define("usuarios", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    numero: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Usuarios.sync({force: false});

export default Usuarios;