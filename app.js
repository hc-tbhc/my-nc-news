const express = require('express');
const app = express();
const { retreiveTopics, retrieveArticleById } = require('./controllers/controller');
const endpointsData = require('./endpoints.json');

app.get('/api/topics', retreiveTopics);

app.get('/api/articles/:id', retrieveArticleById)

app.get('/api', (req, res) => {
    res.status(200).send(endpointsData);
})

app.use('*', (req, res, next) => {
    res.status(404).send({status: 404, message: '404: Not found'});
})

app.use((error, req, res, next) => {
    if (error.status && error.message) {
        res.status(error.status).send({ message: error.message });
    }
})

module.exports = app;