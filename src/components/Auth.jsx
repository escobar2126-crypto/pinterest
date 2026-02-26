import { useState } from "react";
import { supabase } from "../services/supabase";
import "./Auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-logo">✨WELCOME TO PINTEREST✨</h1>
        <p className="auth-subtitle">
          Encuentra ideas que te inspiren
        </p>

        <button className="google-button">
          Continuar con Google
        </button>

        <div className="divider">
          <span>o</span>
        </div>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />

        <button
          onClick={handleLogin}
          className="auth-button primary"
        >
          Iniciar sesión
        </button>

        <button
          onClick={handleSignUp}
          className="auth-button secondary"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}
