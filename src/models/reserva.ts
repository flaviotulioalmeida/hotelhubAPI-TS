import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from "../database/sequelize";

interface ReservaAttributes {
    id: number;
    checkIn: Date;
    checkOut: Date;
    cpf: string;
}

interface ReservaCreationAttributes extends Optional<ReservaAttributes, 'id'> {}

class Reserva extends Model<ReservaAttributes, ReservaCreationAttributes> implements ReservaAttributes {
    public id!: number;
    public checkIn!: Date;
    public checkOut!: Date;
    public cpf!: string;
}

Reserva.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    checkIn: {
        type: DataTypes.DATE,
        allowNull: false
    },
    checkOut: {
        type: DataTypes.DATE,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'reservas'
});

async function sincronizar() {
    await Reserva.sync();
} 

sincronizar();

export default Reserva;