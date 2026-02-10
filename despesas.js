import db from "./db.js";
import { DataTypes, Sequelize } from "sequelize";

const Despesas = db.define("despesas", {
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nomeDespesa: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    tipo: {
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
    },
    fixa: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

Despesas.sync({ force: false });

export default Despesas;