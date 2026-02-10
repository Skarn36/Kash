import db from "./db.js";
import { DataTypes, Sequelize } from "sequelize";

const Metas = db.define('metas', {
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nomeMeta: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    objetivo1: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    objetivo2: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: true,
    },
    tempo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    situacaoAtual: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    }
})

Metas.sync({ force: false });

export default Metas;