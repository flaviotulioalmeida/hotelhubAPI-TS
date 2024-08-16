import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database/sequelize";

interface QuartoAttributes {
    id: number;
    tipo: string;
    preco: number;
    cnpj: string;
}

interface QuartoCreationAttributes extends Optional<QuartoAttributes, 'id'> {}

class Quarto extends Model<QuartoAttributes, QuartoCreationAttributes> implements QuartoAttributes {
    public id!: number;
    public tipo!: string;
    public preco!: number;
    public cnpj!: string;
}

Quarto.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'quartos'
});

async function sincronizar() {
    await Quarto.sync();
} 

sincronizar();

export default Quarto;