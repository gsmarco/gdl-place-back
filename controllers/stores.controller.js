const pool = require('../config/db');
const upload = require('../middleware/upload');

// routes/store.js
const express = require("express");

//===========================================================================
exports.createStore = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        console.log("req.body: ", req.body);

        const { seller_id, store_name, story_title, story_content } = req.body;

        // 👇 Archivos (IMPORTANTE en JS)
        const cover = req.files?.cover_image?.[0];
        const gallery = req.files?.gallery_images || [];

        const coverPath = cover ? `/uploads/${cover.filename}` : null;

        const galleryPaths = gallery.map((img) => {
            return `/uploads/${img.filename}`;
        });

        const query = `
        INSERT INTO stores (
          seller_id, store_name, story_title, story_content, cover_image, gallery_images
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

        const values = [
            seller_id,
            store_name,
            story_title,
            story_content,
            coverPath,
            galleryPaths,
        ];

        console.log("query", query);
        console.log("values", values);

        const result = await client.query(query, values);

        await client.query("COMMIT");

        res.json({
            message: "Tienda guardada correctamente",
            store: result.rows[0],
        });
    } catch (error) {
        // await client.query("ROLLBACK");
        // console.error(error);
        // res.status(500).json({ error: "Error al guardar tienda" });
        await client.query("ROLLBACK");

        console.error("Error completo:", error);

        // 🔥 PostgreSQL error útil
        const message = error.detail || error.message;

        res.status(400).json({
            error: message,
        });

    } finally {
        client.release();
    }
};

exports.getStore = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM stores WHERE seller_id = $1",
            [id],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No existe tienda" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener tienda" });
    }
};


//===============================================================
// exports.getStore_old = async (req, res) => {

//     const { id } = req.params;

//     const result = await pool.query(
//         'SELECT * FROM stores WHERE seller_id = $1',
//         [id]
//     );

//     res.json(result.rows[0]);

// };

const normalizePath = (path) => {
    if (!path) return path;

    // si ya viene completa, quitar dominio
    return path.replace(/^https?:\/\/[^/]+/, "");
};

//=======================================================================================
exports.updateStore = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const { id } = req.params;

        const { store_name, story_title, story_content, existing_images } = req.body;

        // 👇 Archivos
        const cover = req.files?.cover_image?.[0];
        const gallery = req.files?.gallery_images || [];

        // ============================
        // 📌 Obtener datos actuales
        // ============================
        const currentStoreQuery = `SELECT * FROM stores WHERE seller_id = $1`;
        const currentStoreResult = await client.query(currentStoreQuery, [id]);

        if (currentStoreResult.rows.length === 0) {
            return res.status(404).json({ error: "Tienda no encontrada" });
        }

        const currentStore = currentStoreResult.rows[0];

        // ============================
        // 📌 COVER IMAGE
        // ============================
        let coverPath = currentStore.cover_image;

        if (cover) {
            coverPath = `/uploads/${cover.filename}`;
        }

        // ============================
        // 📌 GALERÍA
        // ============================

        // 🔹 imágenes existentes (vienen del frontend como JSON string)

        // let parsedExisting = [];

        // if (existing_images) {
        //     parsedExisting = JSON.parse(existing_images);
        // } else {
        //     parsedExisting = currentStore.gallery_images || [];
        // }

        let parsedExisting = [];

        if (existing_images) {
            parsedExisting = JSON.parse(existing_images).map(normalizePath);
        } else {
            parsedExisting = (currentStore.gallery_images || []).map(normalizePath);
        }

        // 🔹 nuevas imágenes
        const newGalleryPaths = gallery.map((img) => {
            return `/uploads/${img.filename}`;
        });

        const finalGallery = [...parsedExisting, ...newGalleryPaths];

        // ============================
        // 📌 UPDATE QUERY
        // ============================

        const updateQuery = `
            UPDATE stores
            SET 
                store_name = $1,
                story_title = $2,
                story_content = $3,
                cover_image = $4,
                gallery_images = $5
            WHERE seller_id = $6
            RETURNING *;
        `;

        const values = [
            store_name || currentStore.store_name,
            story_title || currentStore.story_title,
            story_content || currentStore.story_content,
            coverPath,
            finalGallery,
            id,
        ];

        const result = await client.query(updateQuery, values);

        await client.query("COMMIT");

        res.json({
            message: "Tienda actualizada correctamente",
            store: result.rows[0],
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ error: "Error al actualizar tienda" });
    } finally {
        client.release();
    }
};
//===========================================================================  

exports.deleteStore = async (req, res) => {

    const { id } = req.params;

    await pool.query(
        'DELETE FROM stores WHERE id=$1',
        [id]
    );

    res.json({ message: "store eliminado" });
};
