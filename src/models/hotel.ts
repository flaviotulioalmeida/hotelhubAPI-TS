import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database/sequelize";

interface HotelAttributes {
    id: string;
    nome: string;
    cnpj: string;
    localizacao: object;
}

interface HotelCreationAttributes extends Optional<HotelAttributes, 'id'> {}

class Hotel extends Model<HotelAttributes, HotelCreationAttributes> implements HotelAttributes {
    public id!: string;
    public nome!: string;
    public cnpj!: string;
    public localizacao!: object;
}

Hotel.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    localizacao: {
        type: DataTypes.GEOMETRY,
    }
}, {
    sequelize,
    modelName: 'hoteis'
});

async function sincronizar() {
    await Hotel.sync();
} 

sincronizar();

export default Hotel;
