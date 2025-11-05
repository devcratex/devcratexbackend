const express = require('express');
const { db } = require('../firebaseAdmin');
const router = express.Router();

// same CRUD as projects but collection = 'blogs'
router.post('/', async (req, res) => {
  try {
    const ref = await db.collection('blogs').add({ ...req.body, createdAt: new Date() });
    res.status(201).json({ id: ref.id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('blogs').orderBy('createdAt', 'desc').get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(list);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('blogs').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    await db.collection('blogs').doc(req.params.id).set(req.body, { merge: true });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.collection('blogs').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;