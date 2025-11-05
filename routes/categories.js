// routes/categories.js
const express = require('express');
const { db } = require('../firebaseAdmin');
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    const trimmedName = name.trim();

    // Optional: Prevent duplicate names
    const snap = await db.collection('categories')
      .where('name', '==', trimmedName)
      .limit(1)
      .get();
    if (!snap.empty) return res.status(400).json({ error: 'Category already exists' });

    const ref = await db.collection('categories').add({
      name: trimmedName,
      createdAt: new Date()
    });

    res.status(201).json({ id: ref.id, name: trimmedName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('categories').orderBy('createdAt', 'desc').get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ ONE (optional)
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('categories').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    await db.collection('categories').doc(req.params.id).set(
      { name: name.trim() },
      { merge: true }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('categories').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;