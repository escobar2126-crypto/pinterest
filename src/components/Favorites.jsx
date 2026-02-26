import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

function Favorites({ session }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        console.log(error);
      } else {
        setFavorites(data);
      }
    };

    fetchFavorites();
  }, [session]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mis Favoritos 💖</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {favorites.map((fav) => (
          <img
            key={fav.id}
            src={fav.image_url}
            alt=""
            style={{ width: "200px", borderRadius: "10px" }}
          />
        ))}
      </div>
    </div>
  );
}

export default Favorites;