const db = {}; // lol

export const get = (id) => {
    return db[id] || {};
};

export const set = (id, subject, description) => {
    db[id] = { subject, description };
};
