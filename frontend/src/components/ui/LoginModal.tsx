"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/AuthContext";
import Image from "next/image";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [showRegister, setShowRegister] = useState(false);
  // Estado para el formulario de registro
  const [registerData, setRegisterData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    contraseña: "",
    telefono: ""
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Estado para el formulario de login
  const [loginData, setLoginData] = useState({
    correo: "",
    contraseña: ""
  });
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  const { login: loginContext } = useAuth();

  // Cierra el modal con Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Manejar cambios en los inputs de registro
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario de registro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (!res.ok) {
        setRegisterError(data.message || "Error al registrar usuario");
      } else {
        setRegisterSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
        setRegisterData({
          nombre: "",
          apellido_paterno: "",
          apellido_materno: "",
          correo: "",
          contraseña: "",
          telefono: ""
        });
        setTimeout(() => {
          setShowRegister(false);
          setRegisterSuccess("");
        }, 1500);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setRegisterError("Error de conexión con el servidor");
    }
  };

  // Manejar cambios en los inputs de login
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario de login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.message || "Credenciales inválidas");
      } else {
        setLoginSuccess("¡Bienvenido!");
        loginContext(data.token, data.user);
        setTimeout(() => {
          setLoginSuccess("");
          onClose();
          // Redirigir al dashboard si es administrador
          if (data.user.rol === "administrador") {
            window.location.href = "/admin";
          }
        }, 1200);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setLoginError("Error de conexión con el servidor");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-2xl p-0 relative overflow-hidden animate-modalOpen">
        <div
          className={`flex w-[200%] transition-transform duration-500 ${showRegister ? '-translate-x-1/2' : 'translate-x-0'}`}
          style={{ minHeight: 500 }}
        >
          {/* Pantalla de Login */}
          <div className="w-1/2 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
                aria-label="Cerrar"
              >
                ×
              </button>
              <div className="text-3xl font-logo mb-6 text-center">SCAM</div>
              <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold mb-2 text-center">Iniciar Sesión</h1>
                <p className="mb-6 text-gray-300 text-center">Accede a tu cuenta para continuar.</p>
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    value={loginData.correo}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-primary"
                  />
                  <input
                    type="password"
                    name="contraseña"
                    placeholder="Contraseña"
                    value={loginData.contraseña}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-primary"
                  />
                  {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
                  {loginSuccess && <div className="text-green-500 text-sm text-center">{loginSuccess}</div>}
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/80 transition"
                  >
                    Iniciar sesión
                  </button>
                </form>
                {/*
                <div className="my-6 flex flex-col gap-3">
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-700 py-2 rounded hover:bg-gray-800 transition">
                    <FaGoogle className="text-lg" /> Iniciar sesión con Google
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-700 py-2 rounded hover:bg-gray-800 transition">
                    <FaFacebookF className="text-lg" /> Iniciar sesión con Facebook
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-700 py-2 rounded hover:bg-gray-800 transition">
                    <FaApple className="text-lg" /> Iniciar sesión con Apple
                  </button>
                </div>
                */}

                <div className="flex flex-col items-center gap-2 mt-4">
                  {/*<a href="#" className="text-primary hover:underline text-sm">¿Olvidaste tu contraseña?</a>*/}
                  <button type="button" onClick={() => setShowRegister(true)} className="text-gray-400 hover:underline text-sm">¿No tienes cuenta? Regístrate</button>
                </div>
              </div>
              <div className="mt-8 text-xs text-gray-500 text-center">&copy; 2024 SCAM</div>
            </div>
            
            <div className="hidden md:block w-1/2 relative h-[600px]">
            <Image
              src="/images/login/login.jpg"
              alt="Cámara de alta calidad para capturar momentos"
              fill
              style={{ objectFit: 'cover' }}
              priority={true}
              className="rounded-r-xl"
            />
          </div>
            
          </div>
          {/* Pantalla de Registro */}
          <div className="w-1/2 flex flex-col md:flex-row">

           <div className="hidden md:block w-1/2 relative h-[600px]">
            <Image
              src="/images/login/register.jpg"
              alt="Cámara de alta calidad para capturar momentos"
              fill
              style={{ objectFit: 'cover' }}
              priority={true}
              className="rounded-l-xl"
            />
          </div> 
            
            <div className="w-full md:w-1/2 p-8 relative flex flex-col justify-center">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-primary text-2xl font-bold"
                aria-label="Cerrar"
              >
                ×
              </button>
              <div className="text-3xl font-logo mb-6 text-center">SCAM</div>
              <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold mb-2 text-center">Registro</h1>
                <p className="mb-6 text-gray-300 text-center">Crea tu cuenta para continuar.</p>
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={registerData.nombre}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="apellido_paterno"
                    placeholder="Apellido paterno"
                    value={registerData.apellido_paterno}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="apellido_materno"
                    placeholder="Apellido materno"
                    value={registerData.apellido_materno}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-primary"
                  />
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo"
                    value={registerData.correo}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-primary"
                  />
                  <input
                    type="password"
                    name="contraseña"
                    placeholder="Contraseña"
                    value={registerData.contraseña}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={registerData.telefono}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-primary"
                  />
                  {registerError && <div className="text-red-500 text-sm text-center">{registerError}</div>}
                  {registerSuccess && <div className="text-green-500 text-sm text-center">{registerSuccess}</div>}
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/80 transition"
                  >
                    Registrarse
                  </button>
                </form>
                <div className="flex flex-col items-center gap-2 mt-4">
                  <button type="button" onClick={() => setShowRegister(false)} className="text-primary hover:underline text-sm">¿Ya tienes cuenta? Inicia sesión</button>
                </div>
              </div>
              <div className="mt-8 text-xs text-gray-500 text-center">&copy; 2024 SCAM</div>
            </div>
          </div>
        </div>
        <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes modalOpen {
          from { transform: scale(0.8) translateY(40px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-modalOpen {
          animation: modalOpen 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
      </div>
    </div>
  );
}
