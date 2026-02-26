import { useState, useEffect } from "react";
import { supabase } from "./services/supabase";
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import Favorites from "./components/Favorites";
import Upload from "./components/Upload";
import Auth from "./components/Auth";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [session, setSession] = useState(null);
  const [view, setView] = useState("feed");
  const [refreshKey, setRefreshKey] = useState(0);

  <Navbar setSearchTerm={setSearchTerm} session={session} setView={setView} />

{view === "feed" && (
  <Feed searchTerm={searchTerm} session={session} />
)}

  const refreshFeed = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });


    // Escuchar cambios de login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Si no hay sesión → mostrar login
  if (!session) {
    return <Auth />;
  }

  return (
    <>
      <Navbar
        setSearchTerm={setSearchTerm}
        session={session}
        setView={setView}
      />

      {/* 🔥 Mostrar Upload SOLO en feed */}
      {view === "feed" && <Upload session={session} onUpload={refreshFeed} />}

      {/* 🔥 FEED */}
      {view === "feed" && (
        <Feed
          key={refreshKey}
          searchTerm={searchTerm}
          session={session}
        />
      )}

      {/* 🔥 FAVORITOS */}
      {view === "favorites" && (
        <Favorites session={session} />
      )}
    </>
  );
}

export default App;