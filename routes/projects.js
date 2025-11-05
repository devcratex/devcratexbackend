// routes/projects.js
const express = require('express');
const { db } = require('../firebaseAdmin');
const router = express.Router();

// CREATE – now accepts categoriesList
router.post('/', async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      images,
      youtubeUrl,
      categoriesList // <-- NEW
    } = req.body;

    // Validation
    if (!slug) return res.status(400).json({ error: 'Slug is required' });
    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });

    const data = {
      name,
      slug,
      description,
      price: Number(price),
      category,
      images: Array.isArray(images) ? images : [],
      youtubeUrl: youtubeUrl?.trim() || null,
      categoriesList: Array.isArray(categoriesList) ? categoriesList : [], // <-- Save full list
      createdAt: new Date()
    };

    const ref = await db.collection('projects').add(data);
    res.status(201).json({ id: ref.id, slug });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// READ ALL – include categoriesList
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('projects')
      .orderBy('createdAt', 'desc')
      .get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('projects').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// UPDATE – allow updating categoriesList
router.put('/:id', async (req, res) => {
  try {
    const { slug, youtubeUrl, categoriesList, ...rest } = req.body;
    const updateData = { ...rest };

    if (slug !== undefined) updateData.slug = slug.trim() || null;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl.trim() || null;
    if (categoriesList !== undefined) {
      updateData.categoriesList = Array.isArray(categoriesList) ? categoriesList : [];
    }

    await db.collection('projects').doc(req.params.id).set(updateData, { merge: true });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('projects').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;