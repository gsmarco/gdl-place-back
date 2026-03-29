const pool = require('../config/db');

// routes/store.js
const express = require("express");

exports.getStore = async (req, res) => {

    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM stores WHERE seller_id = $1',
        [id]
    );

    res.json(result.rows[0]);

};


exports.createStore = async (req, res) => {
    const {
        seller_id,
        store_name,
        story_title,
        story_content,
        cover_image,
        gallery_images,
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO stores 
      (seller_id, store_name, story_title, story_content, cover_image, gallery_images)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
            [seller_id, store_name, story_title, story_content, cover_image, gallery_images]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar historia de la tienda" });
    }
};

exports.updateStore = async (req, res) => {
    const { id } = req.params;

    const {
        store_name,
        story_title,
        story_content,
        cover_image,
        gallery_images,
    } = req.body;

    const result = await pool.query(
        `UPDATE stores SET
        store_name=$1,
        story_title=$2,
        story_content=$3,
        cove_image=$4,
        gallery_images=$5,
        WHERE id=$6
        RETURNING *`,
        [
            store_name,
            story_title,
            story_content,
            cover_image,
            gallery_images,
            id
        ]
    );
}

exports.deleteStore = async (req, res) => {

    const { id } = req.params;

    await pool.query(
        'DELETE FROM stores WHERE id=$1',
        [id]
    );

    res.json({ message: "store eliminado" });
};
