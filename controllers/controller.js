const { getTopics, getArticle, getArticlesSorted, getCommentByArticle, postCommentById, PatchVotesById, deleteCommentByOwnId, getUsers } = require('../models/model');
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
        res.status(200).send({ sortedArticles });
    }).catch((error) => {
        next(error);
    });
}

function retrieveCommentById(req, res, next) {
    const {id} = req.params;
    getCommentByArticle(id)
    .then((comments) => {
        res.status(200).send({ comments });
    }).catch((error) => {
        next(error);
    })
}

function postComment(req, res, next) {
    const {id} = req.params
    const body = req.body;
    postCommentById(id, body)
    .then((comment) => {
        res.status(201).send({ comment })
    }).catch((error) => {
        next(error);
    })
}

function patchVotes(req, res, next) {
    const {id} = req.params;
    const body = req.body;
    PatchVotesById(id, body)
    .then((article) => {
        res.status(200).send({ article })
    }).catch((error) => {
        next(error);
    })  
}

function deleteComment(req, res, next) {
    const {id} = req.params;
    deleteCommentByOwnId(id)
    .then(() => {
        res.status(204).send();
    }).catch((error) => {
        next(error);
    })
}

function retrieveUsers(req, res, next) {
    getUsers()
    .then((users) => {
        res.status(200).send({ users });
    }).catch((error) => {
        next(error);
    });
}

module.exports = { retrieveTopics, retrieveArticleById, retrieveArticles, retrieveCommentById, postComment, patchVotes, deleteComment, retrieveUsers };