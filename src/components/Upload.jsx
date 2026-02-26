import { useState } from "react";
import { supabase } from "../services/supabase";
import "./Upload.css";

function Upload({ session, onUpload }) {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !session) {
            console.log("No hay archivo o no hay sesión");
            return;
        }

        const fileName = `${Date.now()}-${file.name}`;

        // 🔍 Subir al bucket
        const { data: uploadData, error: uploadError } =
            await supabase.storage
                .from("uploads")
                .upload(fileName, file);

        console.log("Upload result:", uploadData, uploadError);

        if (uploadError) {
            alert("Error al subir imagen");
            return;
        }

        // 🔍 Obtener URL pública
        const { data: publicUrlData } = supabase.storage
            .from("uploads")
            .getPublicUrl(fileName);

        console.log("Public URL:", publicUrlData);

        // 🔍 Insertar en tabla
        const { error: insertError } = await supabase
            .from("user_uploads")
            .insert([
                {
                    user_id: session.user.id,
                    image_url: publicUrlData.publicUrl,
                    description: description,
                },
            ]);

        console.log("Insert error:", insertError);

        if (insertError) {
            alert("Error al guardar en la base de datos");
            return;
        }

        alert("Imagen subida 🔥");
        if (onUpload) {
          onUpload();
        }
        setFile(null);
        setDescription("");
    };

    return (
        <div className="upload-container">
            <div className="upload-box">
                <label className="file-label">
                    Seleccionar archivo
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </label>

                <input
                    type="text"
                    placeholder="Añade una descripción..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="upload-input"
                />

                <button onClick={handleUpload} className="upload-button">
                    Guardar
                </button>
                {file && (
                    <span className="file-name">
                        {file.name}
                    </span>
                )}
            </div>
        </div>
    );
}

export default Upload;