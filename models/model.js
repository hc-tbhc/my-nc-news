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
    return db.query(`SELECT author, title, article_id, topic, created_at, votes, article_img_url, (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles ORDER BY created_at DESC`)
    .then((sortedArticle) => {
        return sortedArticle.rows.length === 0 ?  Promise.reject({ status: 404, message: '404: Not found'}) : sortedArticle.rows;
    });
}

function getCommentByArticle(id) {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [id])
    .then((comment) => {
        return comment.rows.length === 0 ?  Promise.reject({ status: 404, message: '404: Not found'}) : comment.rows;
    });
}

function postCommentById(id, body) {
    const votes = body.votes || 0;

    if (!body.username || !body.body) {
        return Promise.reject({status: 400, message: '400: Missing required fields'})
    }

    if (typeof body.username !== 'string' || typeof body.body !== 'string') {
        return Promise.reject({status: 400, message: '400: Failing schema validation'})
    }

    return db.query(`INSERT INTO comments (body, votes, author, article_id) VALUES ($1, $2, $3, $4) RETURNING *`, [body.body, votes, body.username, id])
    .then((comment) => {
        return comment.rows[0];
    })
}

module.exports = { getTopics, getArticle, getArticlesSorted, getCommentByArticle, postCommentById };