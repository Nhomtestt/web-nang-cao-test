const express = require('express');
const productRoutes = require('./routes/products');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Online Shop API' });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

module.exports = app;
