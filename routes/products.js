const express = require('express');
const { query } = require('../database');

const router = express.Router();

const parseId = (value) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const validateProduct = (body) => {
    const { category_id, name, price, quantity, status } = body;
    if (!Number.isInteger(Number(category_id)) || Number(category_id) <= 0) {
        return 'category_id must be a positive integer';
    }
    if (typeof name !== 'string' || name.trim() === '') return 'name is required';
    if (price === '' || price === null || !Number.isFinite(Number(price)) || Number(price) < 0) {
        return 'price must be a non-negative number';
    }
    if (quantity === '' || quantity === null || !Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
        return 'quantity must be a non-negative integer';
    }
    if (status !== undefined && !['active', 'inactive'].includes(status)) {
        return 'status must be active or inactive';
    }
    return null;
};

router.get('/', async (req, res, next) => {
    try {
        const [products] = await query(
            `SELECT p.*, c.name AS category_name
             FROM products p
             JOIN categories c ON c.id = p.category_id
             ORDER BY p.id DESC`
        );
        res.json(products);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'id must be a positive integer' });
    try {
        const [products] = await query(
            `SELECT p.*, c.name AS category_name
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.id = ?`,
            [id]
        );
        if (products.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(products[0]);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    const validationError = validateProduct(req.body);
    if (validationError) return res.status(400).json({ error: validationError });
    try {
        const { category_id, name, description = null, price, quantity, image = null, status = 'active' } = req.body;
        const [result] = await query(
            `INSERT INTO products
             (category_id, name, description, price, quantity, image, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [Number(category_id), name.trim(), description, Number(price), Number(quantity), image, status]
        );
        const [products] = await query(
            `SELECT p.*, c.name AS category_name
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.id = ?`,
            [result.insertId]
        );
        res.status(201).json(products[0]);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'id must be a positive integer' });
    const validationError = validateProduct(req.body);
    if (validationError) return res.status(400).json({ error: validationError });
    try {
        const { category_id, name, description = null, price, quantity, image = null, status = 'active' } = req.body;
        const [result] = await query(
            `UPDATE products
             SET category_id = ?, name = ?, description = ?, price = ?, quantity = ?, image = ?, status = ?
             WHERE id = ?`,
            [Number(category_id), name.trim(), description, Number(price), Number(quantity), image, status, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        const [products] = await query(
            `SELECT p.*, c.name AS category_name
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.id = ?`,
            [id]
        );
        res.json(products[0]);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'id must be a positive integer' });
    try {
        const [result] = await query('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
