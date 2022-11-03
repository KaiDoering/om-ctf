import express from 'express';
import _ from 'lodash';

import { get, set } from './db.mjs';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.sendStatus(200));
app.post('/api/signup', (req, res) => {
    if (!req.body.userName || !req.body.password) {
        res.status(400).send('You need to specify user name and password!');
        return;
    }
    if (!!get(req.body.userName)) {
        res.status(409).send('User already exists!');
        return;
    }
    if (req.body.isAdmin) {
        res.status(401).send('You are not allowed to give yourself admin rights!');
        return;
    }
    /* 
        Use some defaults, if user left unrequired fields empty.
        Dependabot complained about lodash merge in this version 4.6.1.
        I did not really understand what it is about, but I am sure it is nothing too bad...
    */
    const { userName, ...rest } = _.merge({}, { firstName: 'FIRST NAME', lastName: 'LAST NAME' }, req.body);
    set({ id: userName, data: rest });
    res.sendStatus(200);
});
app.post('/api/login', (req, res) => {
    if (!req.body.userName || !req.body.password) {
        res.status(400).send('You need to specify user name and password!');
        return;
    }
    const user = get(req.body.userName) || {};
    if (user.password !== req.body.password) {
        res.sendStatus(401);
        return;
    }
    res.status(200)
        .json({
            flag: user.isAdmin ? process.env.FLAG : null,
            firstName: user.firstName,
            lastName: user.lastName,
        })
        .end();
});
app.use('/', express.static('static', { extensions: ['html'] }));

app.listen(PORT, () => {
    console.log('listening on port', PORT);
});
