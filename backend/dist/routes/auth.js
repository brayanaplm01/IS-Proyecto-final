"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/users', authController.getUsers);
router.post('/register', authController.register);
router.post('/login', authController.login);

// Añadir rutas para editar y eliminar usuario por ID
router.put('/users/:id', authController.updateUser); // Asumiendo una función updateUser en el controlador
router.delete('/users/:id', authController.deleteUser); // Asumiendo una función deleteUser en el controlador

// Ruta para actualizar el perfil del usuario autenticado
router.put('/perfil', authMiddleware, authController.updateProfile);

module.exports = router;
