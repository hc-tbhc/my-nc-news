const db = require('../db/connection')
const articles = require('../db/data/test-data/articles');

function getTopics() {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows;
    });
}

function getArticle(id) {
    const notFoundMsg = { status: 404, message: '404: Not found'};
    const badReqMsg = { status: 400, message: '400: Bad request'};
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((article) => {
        return article.rows.length === 0 ?  Promise.reject({ status: 404, message: '404: Not found'}) : article.rows[0];
    });
}

module.exports = { getTopics, getArticle };