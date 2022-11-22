import express from 'express';
import cookieParser from 'cookie-parser';
import puppeteer from 'puppeteer';

import { get, set } from './db.mjs';

const PORT = process.env.PORT || 8080;

const getRandomString = () => {
    return Math.random().toString(36).replace('0.', '');
}

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    if (!req.cookies['secret-token']) {
        res.cookie('secret-token', `${getRandomString()}${getRandomString()}${getRandomString()}${getRandomString()}`, { maxAge: 3600000 });
    }
    next();
});

app.get('/health', (req, res) => res.sendStatus(200));
app.post('/api/submit', (req, res) => {
    if (!req.body.subject || !req.body.description) {
        res.status(400).send('You need to provide subject and description!');
        return;
    }
    const id = getRandomString();
    set(id, req.body.subject, req.body.description);

    (async () => {
        try {
            const browser = await puppeteer.launch({
                executablePath: '/usr/bin/google-chrome',
                args: ['--no-sandbox'],
            });
            const page = await browser.newPage();

            await page.setCookie({
                'name': 'secret-token',
                'value': 'CTF{hav3_you_7ried_turning_1t_off_and_0n_again}',
                'domain': 'localhost',
                'path': '/',
                'max-age': 3600000,
                'size': 47,
                'httpOnly': false,
                'secure': false,
                'session': false,
                'sameParty': false,
                'sourceScheme': 'NonSecure',
                'sourcePort': PORT,
            });
            await page.goto(`http://localhost:${PORT}/ticket/${id}`);
            await new Promise(resolve => setTimeout(resolve, 500));

            await browser.close();
        } catch (err) {
            console.log(err);
        }
    })();

    return res.status(200).json({ id });
});
app.get('/ticket/:id', (req, res) => {
    const { subject, description } = get(req.params.id);
    return res.setHeader('Content-Type', 'text/html').send(`
    <!DOCTYPE html>

    <html>
        <head>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <h1>${subject}</h1>
            <textarea>${description}</textarea>
        </body>
    </html>
    `);
});
app.use('/', express.static('static', { extensions: ['html'] }));

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});
