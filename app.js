const express = require('express');
const app = express();
const endpointsData = require('./endpoints.json');
const { retrieveTopics, retrieveArticleById } = require('./controllers/controller');

app.get('/api/topics', retrieveTopics);

app.get('/api', (req, res) => {
    res.status(200).send(endpointsData);
})

app.use('*', (req, res, next) => {
    res.status(404).send({message: 'Path not found'});
})

module.exports = app;