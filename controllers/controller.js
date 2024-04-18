const { getTopics, getArticle } = require('../models/model');
const endpointsData = require('../endpoints.json');
const articles = require('../db/data/test-data/articles');

function retreiveTopics(req, res, next) {
    getTopics()
    .then((result) => {
        res.status(200).send({topics: result});
    }).catch((error) => {
        next(error);
    })
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

module.exports = { retreiveTopics, retrieveArticleById };