/*
 * (C) Copyright 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// General modules
const config = require('../config/config');
const debug = require('debug')('explorer');
const fs = require('fs');
const randomstring = require('randomstring');


const url = require('url');

// standalone Elasticsearch client
const elasticsearch = require('elasticsearch');
const path = require("path");
const esclient = new elasticsearch.Client({
    host: config.elasticsearch.location,
    log: 'info',
    requestTimeout: 120000,
    deadTimeout: 130000
});

exports.upload = (req, res) => {
    // check user level

    let id = randomstring.generate(config.id_length);

    // add geohashes with java program


    esclient.index({
        index: config.elasticsearch.index,
        type: config.elasticsearch.type.compendia,
        id: id,
        body: req.body
    }).then(function (resp) {
        debug('Document  %s indexed. Elasticsearch response: %s.', id, JSON.stringify(resp));
        res.status(200).send({ id: id });
    }).catch(function (err) {
        debug('Error creating index: %s', err);
        res.status(500).send({error: err});
    });

};

exports.uploadBulk = (req, res) => {
    req.setTimeout(100000);
    debug('Timeout: %s', req._idleTimout);
    let path = req.query.path;

    //read path:
    let numDocs = 0;

    return readFiles(path, function(filename, content) {
        let doc = JSON.parse(content);
        // body.push({ index:  { _index: config.elasticsearch.index, _type: config.elasticsearch.type, _id: filename } });
        // body.push(doc);

        esclient.index({
            index: config.elasticsearch.index,
            type: config.elasticsearch.type.compendia,
            id: filename,
            body: doc
        }).then(function (resp) {
            debug('Document  %s indexed. Elasticsearch response: %s.', filename, JSON.stringify(resp));
            numDocs++;
        }).catch(function (err) {
            debug('Error creating index: %s', err);
            res.status(500).send({error: err});
        });

    }, function(err) {
        debug(err);
    });


};

function readFiles(dirname, onFileContent, onError) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(path.join(dirname, filename), 'utf-8', function(err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content);
            });
        });
    });
}