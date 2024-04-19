const { getTopics, getArticle, getArticlesSorted, getCommentByArticle } = require('../models/model');
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
    .then((sortedArticles) => {
        res.status(200).send(sortedArticles);
    }).catch((error) => {
        next(error);
    });
}

function retrieveCommentById(req, res, next) {
    const {id} = req.params;
    // console.log(req.query);
    getCommentByArticle(id)
    .then((comments) => {
        res.status(200).send(comments);
    }).catch((error) => {
        next(error);
    })
}

module.exports = { retrieveTopics, retrieveArticleById, retrieveArticles, retrieveCommentById };