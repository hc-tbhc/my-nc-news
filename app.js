const express = require('express');
const app = express();
const { retrieveTopics, retrieveArticleById, retrieveArticles, retrieveCommentById, postComment, patchVotes } = require('./controllers/controller');
const endpointsData = require('./endpoints.json');

app.use(express.json())

app.get('/api/topics', retrieveTopics);

app.get('/api/articles/:id', retrieveArticleById);

app.get('/api', (req, res) => {
    res.status(200).send({endpoints: endpointsData});
})

app.get('/api/articles', retrieveArticles);

app.get('/api/articles/:id/comments', retrieveCommentById);

app.post('/api/articles/:id/comments', postComment);

app.patch('/api/articles/:id', patchVotes);

app.use('*', (req, res, next) => {
    res.status(404).send({status: 404, message: '404: Not found'});
});

app.use((error, req, res, next) => {
    if (error.code === '22P02') {
            res.status(400).send({ message: '400: Bad request' });
        } else if (error.status && error.message) {
                res.status(error.status).send({ message: error.message });
        } else {
                res.status(500).send({ message: '500: Internal sever error '});
        }
})

module.exports = app;