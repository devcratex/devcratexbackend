const express = require('express');
const cors = require('cors');
const projectsRouter = require('./routes/projects');
const blogsRouter = require('./routes/blogs');
const categoryRoutes = require('./routes/categories')
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/devapi/projects', projectsRouter);
app.use('/devapi/blogs', blogsRouter);
app.use('/devapi/categories', categoryRoutes);

app.get('/', (req, res) => res.send('Admin API'));

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));