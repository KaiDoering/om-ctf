const db = {}; // lol

export const get = (userName) => {
    return db[userName];
};

export const set = ({ id, data }) => {
    db[id] = data;
};
