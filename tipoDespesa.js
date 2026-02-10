import db from "./db.js";
import { Sequelize, DataTypes } from "sequelize";

const TipoDespesa = db.define("tipodespesa", {
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    diaHorario: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

TipoDespesa.sync({ force: false });

export default TipoDespesa;