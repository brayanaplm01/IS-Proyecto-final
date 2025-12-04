"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database').default;
class User extends Model {
    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.contraseña);
    }
}
User.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    apellido_paterno: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    apellido_materno: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    contraseña: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    rol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'cliente',
    },
}, {
    sequelize,
    modelName: 'usuarios',
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            if (user.contraseña) {
                const salt = await bcrypt.genSalt(10);
                user.contraseña = await bcrypt.hash(user.contraseña, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('contraseña')) {
                const salt = await bcrypt.genSalt(10);
                user.contraseña = await bcrypt.hash(user.contraseña, salt);
            }
        },
    },
});
exports.default = User;
