import express from 'express';

const PORT = process.env.PORT || 8080;

const app = express();

app.get('/health', (req, res) => res.sendStatus(200));
app.use('/', express.static('static', { extensions: ['html'] }));

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});
