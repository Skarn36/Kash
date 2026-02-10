import db from "./db.js";
import { DataTypes, Sequelize } from "sequelize";

const Receitas = db.define('receitas', {
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    nomeReceita: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    diaHorario: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    valor: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: false,
    }
});

Receitas.sync({ force: false });

export default Receitas;