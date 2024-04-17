const { getTopics } = require('../models/model');
const endpointsData = require('../endpoints.json');

function retrieveTopics(req, res, next) {
    getTopics()
    .then((result) => {
        res.status(200).send({topics: result});
    }).catch((error) => {
        console.log(error);
    })
}

module.exports = { retrieveTopics };