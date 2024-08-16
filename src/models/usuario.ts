import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database/sequelize";

interface UsuarioAttributes {
    cpf: string;
    telefone1: string;
    telefone2: string;
    email: string;
    nome: string;
    preco: number;
    checkIn: Date;
    checkOut: Date;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'cpf'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
    public cpf!: string;
    public telefone1!: string;
    public telefone2!: string;
    public email!: string;
    public nome!: string;
    public preco!: number;
    public checkIn!: Date;
    public checkOut!: Date;
}

Usuario.init({
    cpf: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    telefone1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    checkIn: {
        type: DataTypes.DATE,
        allowNull: false
    },
    checkOut: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'usuarios'
});

async function sincronizar() {
    await Usuario.sync();
} 

sincronizar();

export default Usuario;