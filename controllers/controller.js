const { getTopics, getArticle, getArticlesSorted } = require('../models/model');
const endpointsData = require('../endpoints.json');
const articlesData = require('../db/data/test-data/articles');

function retrieveTopics(req, res, next) {
    getTopics()
    .then((result) => {
        res.status(200).send({topics: result});
    }).catch((error) => {
        next(error);
    });
}

function retrieveArticleById(req, res, next) {
    const {id} = req.params;
    getArticle(id)
    .then((article) => {
        res.status(200).send({ article });
    }).catch((error) => {
        next(error);
    })
}

function retrieveArticles(req, res, next) {
    getArticlesSorted()
    .then((result) => {
        const articlesToSend = result.map((article) => {
            delete article.body;
            return article;
        })
        res.status(200).send({ articles: articlesToSend });
    }).catch((error) => {
        next(error);
    });
}

module.exports = { retrieveTopics, retrieveArticleById, retrieveArticles };