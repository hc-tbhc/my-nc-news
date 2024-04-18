const db = require('../db/connection')
const articles = require('../db/data/test-data/articles');

function getTopics() {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows;
    });
}

function getArticle(id) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((article) => {
        return article.rows.length === 0 ?  Promise.reject({ status: 404, message: '404: Not found'}) : article.rows[0];
    });
}

function getArticlesSorted() {
    // console.log('In model');
    return db.query(`SELECT *, (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles ORDER BY created_at DESC`)
    .then((sortedArticle) => {
        return sortedArticle.rows.length === 0 ?  Promise.reject({ status: 404, message: '404: Not found'}) : sortedArticle.rows;
    });
}

module.exports = { getTopics, getArticle, getArticlesSorted };