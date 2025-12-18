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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, apellido_paterno, apellido_materno, correo, contraseña, telefono, rol } = req.body;
        // Verificar si el usuario ya existe
        const existingUser = yield User_1.default.findOne({ where: { correo } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        // Crear nuevo usuario
        const user = yield User_1.default.create({
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            contraseña,
            telefono,
            rol: rol || 'cliente'
        });
        // Generar token
        const token = jsonwebtoken_1.default.sign({ userId: user.id_usuario, rol: user.rol }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            token,
            user: {
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                apellido_paterno: user.apellido_paterno,
                apellido_materno: user.apellido_materno,
                correo: user.correo,
                telefono: user.telefono,
                rol: user.rol
            }
        });
    }
    catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo, contraseña } = req.body;
        // Buscar usuario
        const user = yield User_1.default.findOne({ where: { correo } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        // Verificar contraseña
        const isMatch = yield user.comparePassword(contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        // Generar token
        const token = jsonwebtoken_1.default.sign({ userId: user.id_usuario, rol: user.rol }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                apellido_paterno: user.apellido_paterno,
                apellido_materno: user.apellido_materno,
                correo: user.correo,
                telefono: user.telefono,
                rol: user.rol
            }
        });
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});
exports.login = login;
exports.getUsers = async (req, res) => {
    try {
        const users = await User_1.default.findAll();
        res.json(users);
    }
    catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};
exports.updateUser = async (req, res) => {
    try {
        
        const { id } = req.params; // Obtener el ID del usuario de los parámetros de la ruta
        
        const { nombre, apellido_paterno, apellido_materno, telefono, rol } = req.body; // Obtener los datos del cuerpo de la solicitud

        // Buscar el usuario por ID
        const user = await User_1.default.findByPk(id);

        if (!user) {
            console.log('DEBUG: Usuario no encontrado con ID:', id); // DEBUG
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log('DEBUG: Usuario encontrado, procediendo a actualizar...'); // DEBUG

        // Actualizar los campos del usuario
        user.nombre = nombre;
        user.apellido_paterno = apellido_paterno;
        user.apellido_materno = apellido_materno;
        user.telefono = telefono;
        user.rol = rol; // Asegúrate de tener lógica para validar o permitir el cambio de rol si es necesario

        // Guardar los cambios en la base de datos
        await user.save();

        
        res.status(200).json({ message: 'Usuario actualizado exitosamente', user });

    } catch (error) {
        
        res.status(500).json({ message: 'Error interno del servidor al actualizar usuario' });
    }
};

// Función para eliminar un usuario por ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del usuario de los parámetros de la ruta

        // Buscar el usuario por ID y eliminarlo
        const deletedRowCount = await User_1.default.destroy({
            where: { id_usuario: id } // Usar el nombre de la columna en la base de datos
        });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar usuario' });
    }
};

// Función para actualizar el perfil del usuario autenticado
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId; // ID del usuario desde el middleware de autenticación
        const { nombre, apellido_paterno, apellido_materno, correo, telefono, password } = req.body;

        // Buscar el usuario por ID
        const user = await User_1.default.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el correo ya está en uso por otro usuario
        if (correo !== user.correo) {
            const existingUser = await User_1.default.findOne({ where: { correo } });
            if (existingUser) {
                return res.status(400).json({ error: 'El correo ya está en uso' });
            }
        }

        // Actualizar los campos del usuario
        user.nombre = nombre || user.nombre;
        user.apellido_paterno = apellido_paterno || user.apellido_paterno;
        user.apellido_materno = apellido_materno || user.apellido_materno;
        user.correo = correo || user.correo;
        user.telefono = telefono || user.telefono;

        // Si se proporciona una nueva contraseña, actualizarla
        if (password) {
            user.contraseña = password; // El modelo se encargará del hash
        }

        // Guardar los cambios en la base de datos
        await user.save();

        res.json({
            message: 'Perfil actualizado exitosamente',
            usuario: {
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                apellido_paterno: user.apellido_paterno,
                apellido_materno: user.apellido_materno,
                correo: user.correo,
                telefono: user.telefono,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};