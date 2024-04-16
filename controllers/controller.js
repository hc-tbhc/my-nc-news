const { getTopics } = require('../models/model');

function retreiveTopics(req, res, next) {
    getTopics()
    .then((result) => {
        res.status(200).send({topics: result});
    }).catch((error) => {
        console.log(error);
    })
}

module.exports = { retreiveTopics };