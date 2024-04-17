const db = require('../db/connection');

function getTopics() {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows;
    });
}

module.exports = { getTopics };