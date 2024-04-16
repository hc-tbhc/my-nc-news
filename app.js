const express = require('express');
const app = express();
const { retreiveTopics } = require('./controllers/controller');

app.get('/api/topics', retreiveTopics);




app.use('*', (req, res, next) => {
    res.status(404).send({message: 'Path not found'});
})

module.exports = app;