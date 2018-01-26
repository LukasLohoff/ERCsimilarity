// General modules
const config = require('../config/config');
const debug = require('debug')('explorer');
const fs = require('fs');

const url = require('url');

// standalone Elasticsearch client
const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({
    host: config.elasticsearch.location,
    log: 'info'
});

//explore from ID, GET
exports.exploreFromReference = (req, res) => {

    if (typeof req.params.id === 'undefined') {
        res.status(404).send({error: 'No id provided'});
    }

    let fields;
    fields = getFieldsFromType(req.query.type);
    debug('Starting search with fields %s.', fields.toString());

    debug('Querying index %s with settings %s on fields %s',
        config.elasticsearch.index,
        JSON.stringify(config.elasticsearch),
        JSON.stringify(fields));


    esclient.search({
        index: config.elasticsearch.index,
        size: config.elasticsearch.searchSize,
        body: {
            explain: false,
            query: {
                more_like_this: {
                    fields: fields,
                    like: [
                        {
                            _index: config.elasticsearch.index,
                            _type: config.elasticsearch.type.compendia,
                            _id: req.params.id
                        }
                    ],
                    min_term_freq: config.elasticsearch.mlt.min_term_freq,
                    max_query_terms: config.elasticsearch.mlt.max_query_terms,
                    min_doc_freq: config.elasticsearch.mlt.min_doc_freq,
                    minimum_should_match: config.elasticsearch.mlt.minimum_should_match,
                    // max_doc_freq: config.elasticsearch.mlt.max_doc_freq,
                    max_word_length: config.elasticsearch.max_word_length,
                    min_word_length: config.elasticsearch.min_word_length,
                    stop_words: config.elasticsearch.stop_words,
                    include: config.elasticsearch.include
                }
            }
        }

    }).then(function (resp) {
        debug('MLT query successful. Got %s results', JSON.stringify(resp.hits.total));
        //todo send json response
        res.status(200).send(resp);
    }).catch(function (err) {
        debug('Error querying index: %s', err);
        res.status(500).send({error: err});
    });

};

//explore from ID, GET
exports.bruteForceSpatialExplore = (req, res) => {

    if (typeof req.params.id === 'undefined') {
        res.status(404).send({error: 'No id provided'});
    }

    let fields;
    fields = getFieldsFromType(req.query.type);
    debug('Starting search with fields %s.', fields.toString());

    esclient.search({
        index: config.elasticsearch.index,
        size: config.elasticsearch.searchSize,
        body: {
            query: {
                more_like_this: {
                    fields: fields,
                    like: [
                        {
                            _index: config.elasticsearch.index,
                            _type: config.elasticsearch.type.compendia,
                            _id: req.params.id
                        }
                    ],
                    min_term_freq: config.elasticsearch.mlt.min_term_freq,
                    max_query_terms: config.elasticsearch.mlt.max_query_terms,
                    min_doc_freq: config.elasticsearch.mlt.min_doc_freq,
                    minimum_should_match: config.elasticsearch.mlt.minimum_should_match,
                    // max_doc_freq: config.elasticsearch.mlt.max_doc_freq,
                    max_word_length: config.elasticsearch.max_word_length,
                    min_word_length: config.elasticsearch.min_word_length,
                    stop_words: config.elasticsearch.stop_words,
                    include: config.elasticsearch.include
                }
            }
        }

    }).then(function (resp) {
        debug('MLT query successful. Got %s results', JSON.stringify(resp.hits.total));
        //todo send json response
        res.status(200).send(resp);
    }).catch(function (err) {
        debug('Error querying index: %s', err);
        res.status(500).send({error: err});
    });

};

//explore from JSON, POST
exports.exploreFromData = (req, res) => {

    let fields;
    fields = getFieldsFromType(req.query.type);
    debug('Starting search with fields %s.', fields.toString());

    esclient.search({
        index: config.elasticsearch.index,
        size: config.elasticsearch.searchSize,
        body: {
            query: {
                more_like_this : {
                    fields : fields,
                    like : [
                        {
                            _index : config.elasticsearch.index,
                            _type : config.elasticsearch.type.compendia,
                            doc : req.body
                        }
                    ],
                    min_term_freq: config.elasticsearch.mlt.min_term_freq,
                    max_query_terms: config.elasticsearch.mlt.max_query_terms,
                    min_doc_freq: config.elasticsearch.mlt.min_doc_freq,
                    minimum_should_match: config.elasticsearch.mlt.minimum_should_match,
                    // max_doc_freq: config.elasticsearch.mlt.max_doc_freq,
                    max_word_length: config.elasticsearch.max_word_length,
                    min_word_length: config.elasticsearch.min_word_length,
                    stop_words: config.elasticsearch.stop_words,
                    include: config.elasticsearch.include

                }
            }
        }

    }).then(function (resp) {
        debug('MLT query successful. Got %s results', JSON.stringify(resp.hits.total));
        //todo send json response
        res.status(200).send(resp);
    }).catch(function (err) {
        debug('Error querying index: %s', err);
        res.status(500).send({error: err});
    });



};



//explore from JSON, POST
exports.getSimilarityMatrix = (req, res) => {
    let allIDs = [];

    //get all documents

    esclient.search({
        index: config.elasticsearch.index,
        size: config.elasticsearch.searchSize,
        body: {
            query: {
                match_all : {}
            }
        }
    }).then(function (resp) {
        debug('Match all. Got %s results', resp.hits.total);
        for (let i = 0; i < resp.hits.hits.length; i++) {
            allIDs.push(resp.hits.hits[i]._id);
        }
        debug('Got all docs');

        let fields;
        fields = getFieldsFromType(req.query.type);
        debug('Starting search with fields %s.', fields.toString());

        findSimilar(allIDs, fields)
            .then(function (matrix) {
                debug('Request succesful, matrix: %s', JSON.stringify(matrix));
                res.status(200).send(matrix);
            }).catch(function (err) {
            debug(err);
        });


    }).catch(function (err) {
        debug('Error querying index: %s', err);
        res.status(500).send({error: err});
    });

};

exports.getSimilarityMatrixBruteForce = (req, res) => {
    let allIDs = [];

    //get all documents

    esclient.search({
        index: config.elasticsearch.index,
        size: 50,
        body: {
            query: {
                match_all : {}
            }
        }
    }).then(function (resp) {
        debug('Match all. Got %s results', resp.hits.total);
        for (let i = 0; i < resp.hits.hits.length; i++) {
            allIDs.push(resp.hits.hits[i]._id);
        }
        debug('Got all docs');

        let fields = [];

        if (req.query.type === 'spatial') {
            debug('Starting spatial search.');
            fields = ['geohashes'];
        } else {
            debug('Starting normal search');
            fields = ['dependencies', 'variable_names', 'functions'];
        }

        findSimilar(allIDs, fields)
            .then(function (matrix) {
                debug('Request succesful, matrix: %s', JSON.stringify(matrix));
                res.status(200).send(matrix);
            }).catch(function (err) {
            debug(err);
        });


    }).catch(function (err) {
        debug('Error querying index: %s', err);
        res.status(500).send({error: err});
    });

};

function findSimilar (documents, fields) {
    return new Promise((resolve, reject) => {

        //for each document, find similar documents
        let matrix = [];
        let promises = [];

        for (let i = 0; i < documents.length; i++) {
            let documentID = documents[i];
            let promise = esclient.search({
                index: config.elasticsearch.index,
                size: config.elasticsearch.searchSize,
                body: {
                    query: {
                        more_like_this: {
                            fields: fields,
                            like: [
                                {
                                    _index: config.elasticsearch.index,
                                    _type: config.elasticsearch.type.compendia,
                                    _id: documentID
                                }
                            ],
                            min_term_freq: config.elasticsearch.mlt.min_term_freq,
                            max_query_terms: config.elasticsearch.mlt.max_query_terms,
                            min_doc_freq: config.elasticsearch.mlt.min_doc_freq,
                            minimum_should_match: config.elasticsearch.mlt.minimum_should_match,
                            //max_doc_freq: config.elasticsearch.mlt.max_doc_freq,
                            max_word_length: config.elasticsearch.max_word_length,
                            min_word_length: config.elasticsearch.min_word_length,
                            stop_words: config.elasticsearch.stop_words,
                            include: config.elasticsearch.include
                        }
                    }
                }
            }).then(function (resp) {
                debug('MLT query with fields %s for %s successful. Got %s results', fields.toString(), documentID, resp.hits.total);
                let row = [];

                for (let j = 0; j < resp.hits.hits.length; j++) {
                    let item = resp.hits.hits[j];
                    let rowItem = {};
                    rowItem.id = item._id;
                    rowItem.score = item._score;
                    row.push(rowItem);
                }

                let result = {};
                result.id = documentID;
                result.row = row;

                if (result.row.length > 0){
                    matrix.push(result);
                }

            }).catch(function (err) {
                debug('Error querying index: %s', err);
                reject(err);
            });
            promises.push(promise);
        }

        Promise.all(promises).then(function () {
            resolve(matrix);
        }).catch(function (err) {
            debug(err);
            reject(err);
        });
    });
}

function getFieldsFromType(type) {

    let fields = [];

    switch (type) {
        case 'spatial' :
            fields = ['geohashes'];
            break;
        case 'text' :
            fields = ['text'];
            break;
        case 'functions' :
            fields = ['functions'];
            break;
        case 'dependencies' :
            fields = ['dependencies'];
            break;
        case 'variable_names' :
            fields = ['variable_names'];
            break;
        case 'code' :
            fields = ['dependencies', 'variable_names', 'functions'];
            break;
        case 'all' :
            fields = ['dependencies', 'variable_names', 'functions', 'text', 'geohashes'];
            break;
        default :
            fields = ['dependencies', 'variable_names', 'functions'];
    }

    return fields;
}