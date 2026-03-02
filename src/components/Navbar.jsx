import { useState } from "react";
import "./Navbar.css";
import { supabase } from "../services/supabase";

function Navbar({ setSearchTerm, session, setView }) {

  // ✅ EL HOOK VA AQUÍ (DENTRO DEL COMPONENTE)
  const [localSearch, setLocalSearch] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="navbar">

      <div className="navbar-left">
        <h2
          className="logo"
          onClick={() => {
            setSearchTerm("");
            setView("feed");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Pinterest
        </h2>
      </div>

      <div className="navbar-center">
        <div className="search-wrapper">
          <input
            className="search-input"
            placeholder="Buscar..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(localSearch);
              }
            }}
          />

          <button
            className="pinterest-btn search-btn"
            onClick={() => setSearchTerm(localSearch)}
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="navbar-right">

        <button
          className="nav-btn"
          onClick={() => setView("favorites")}
        >
          Favoritos
        </button>

        <div className="avatar">
          {session?.user?.email?.[0]?.toUpperCase()}
        </div>

        <button
          className="nav-btn logout"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>

      </div>

    </div>
  );
}

export default Navbar;