import { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabase";
import "./Feed.css";

const ACCESS_KEY = "dDUd_v0FA4zjQBl7pMXMyDy2mp9ugCTwxzShr6JBSzE";

function Feed({ searchTerm, session }) {
  const [images, setImages] = useState([]);
  const [userUploads, setUserUploads] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [likedImages, setLikedImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const loadingRef = useRef(false);

  /* =========================
     🔥 DEBOUNCE BUSCADOR
  ========================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
      setImages([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* =========================
     🔥 CARGAR UPLOADS
  ========================== */
  useEffect(() => {
    const fetchUploads = async () => {
      const { data } = await supabase
        .from("user_uploads")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setUserUploads(data);
    };

    fetchUploads();
  }, []);

  /* =========================
     🔥 CARGAR FAVORITOS
  ========================== */
  useEffect(() => {
    if (!session) return;

    const fetchSaved = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("image_id")
        .eq("user_id", session.user.id);

      if (data) setSavedImages(data.map((i) => i.image_id));
    };

    fetchSaved();
  }, [session]);

  /* =========================
     🔥 CARGAR LIKES
  ========================== */
  useEffect(() => {
    if (!session) return;

    const fetchLikes = async () => {
      const { data } = await supabase
        .from("likes")
        .select("image_id")
        .eq("user_id", session.user.id);

      if (data) setLikedImages(data.map((i) => i.image_id));
    };

    fetchLikes();
  }, [session]);

  /* =========================
     🔥 FETCH UNSPLASH
  ========================== */
  useEffect(() => {
    const fetchImages = async () => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const url = debouncedSearch
          ? `https://api.unsplash.com/search/photos?page=${page}&per_page=20&query=${debouncedSearch}&client_id=${ACCESS_KEY}`
          : `https://api.unsplash.com/photos?page=${page}&per_page=20&client_id=${ACCESS_KEY}`;

        const res = await fetch(url);

        if (!res.ok) {
          console.log("Unsplash error:", await res.text());
          return;
        }

        const data = await res.json();
        const newImages = debouncedSearch ? data.results : data;

        setImages((prev) =>
          page === 1 ? newImages : [...prev, ...newImages]
        );
      } catch (err) {
        console.log("Error fetching images:", err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };

    fetchImages();
  }, [page, debouncedSearch]);

  /* =========================
     🔥 SCROLL INFINITO
  ========================== */
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     🔥 CARGAR COMENTARIOS POR IMAGEN
  ========================== */
  const fetchComments = async (imageId) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("image_id", imageId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setComments(data);
    }
  };

  /* =========================
     🔥 GUARDAR
  ========================== */
  const handleSave = async (image) => {
    if (!session || savedImages.includes(image.id)) return;

    const { error } = await supabase.from("favorites").insert([
      {
        user_id: session.user.id,
        image_id: image.id,
        image_url: image.image_url || image.urls?.small,
      },
    ]);

    if (!error) {
      setSavedImages((prev) => [...prev, image.id]);
    }
  };

  /* =========================
     🔥 LIKE
  ========================== */
  const handleLike = async (image) => {
    if (!session || likedImages.includes(image.id)) return;

    const { error } = await supabase.from("likes").insert([
      {
        user_id: session.user.id,
        image_id: image.id,
      },
    ]);

    if (!error) {
      setLikedImages((prev) => [...prev, image.id]);
    }
  };

  /* =========================
     🔥 COMENTAR
  ========================== */
  const handleComment = async () => {
    if (!newComment.trim() || !session) return;

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          user_id: session.user.id,
          image_id: selectedImage.id,
          content: newComment,
        },
      ])
      .select();

    if (!error && data) {
      setComments((prev) => [...prev, data[0]]);
      setNewComment("");
    }
  };

  return (
    <>
      <div className="feed">
        {(debouncedSearch
          ? images
          : [...userUploads, ...images]
        ).map((image, index) => {
          if (!image || !image.id) return null;

          const imageUrl =
            image.image_url || image.urls?.small;

          if (!imageUrl) return null;

          return (
            <div
              key={`${image.id}-${index}`}
              className="card"
              onClick={() => {
                console.log("CLICK OK");
                setSelectedImage(image);
                fetchComments(image.id); // 🔥 aquí
              }}
            >
              <img
                className="feed-image"
                src={imageUrl}
                alt=""
              />

              <div className="overlay">
                <button
                  className="pinterest-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(image);
                  }}
                  style={{
                    background: savedImages.includes(image.id)
                      ? "#999"
                      : "#e60023",
                  }}
                >
                  {savedImages.includes(image.id)
                    ? "Guardado"
                    : "Guardar"}
                </button>
              </div>

              <button
                className="like-floating"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(image);
                }}
              >
                {likedImages.includes(image.id)
                  ? "❤️"
                  : "🤍"}
              </button>
            </div>
          );
        })}
      </div>

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>
          Cargando...
        </p>
      )}

      {selectedImage && (
        <div
          className="modal"
          onClick={() => {
            setSelectedImage(null);
            setComments([]); // 🔥 limpiar
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="modal-left"
              src={
                selectedImage.image_url ||
                selectedImage.urls?.regular
              }
              alt=""
            />

            <div className="modal-right">
              <button
                className="modal-save"
                onClick={() => handleSave(selectedImage)}
              >
                {savedImages.includes(selectedImage.id)
                  ? "Guardado"
                  : "Guardar"}
              </button>

              <button
                className="modal-like"
                onClick={() => handleLike(selectedImage)}
              >
                {likedImages.includes(selectedImage.id)
                  ? "❤️"
                  : "🤍"}
              </button>

            

              <h3>Comentarios</h3>

              <input
                className="comment-input"
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <button
                className="modal-send"
                onClick={handleComment}
              >
                Enviar
              </button>

              <div>
                {comments.map((c) => (
                  <p key={c.id}>
                    {c.content}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Feed;