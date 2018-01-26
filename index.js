const config = require('./config/config');
const mapping = require('./esconfig/mapping');
const settings = require('./esconfig/settings');
const debug = require('debug')('explorer');

// standalone Elasticsearch client
const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({
    host: config.elasticsearch.location,
    log: 'info'
});

const fs = require('fs');

// Express modules and tools
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(compression());

app.use((req, res, next) => {
    debug(req.method + ' ' + req.path);
    next();
});

// load controllers
const upload = require('./controllers/upload');
const explore = require('./controllers/explore');
const visualize = require('./controllers/map/visualize');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/api/v' + config.api_version + '/explore/:id', explore.exploreFromReference);
app.post('/api/v' + config.api_version + '/explore', explore.exploreFromData);
app.get('/api/v' + config.api_version + '/matrix', explore.getSimilarityMatrix);

app.post('/api/v' + config.api_version + '/exploreBruteForce', explore.bruteForceSpatialExplore);



app.get('/api/v' + config.api_version + '/visualize/:id', visualize.visualizeFromReference);

app.post('/api/v' + config.api_version + '/upload/:id', upload.upload);
app.get('/api/v' + config.api_version + '/bulk/', upload.uploadBulk);



const server = app.listen(config.net.port, () => {

    esclient.indices.exists({ index: config.elasticsearch.index })
        .then(function (resp) {
            // Delete possibly existing index if deleteIndexOnStartup is true
            if (resp) {
                debug('Index %s already exists.', config.elasticsearch.index);
                if (config.elasticsearch.deleteIndexOnStartup) {
                    debug('Deleting elasticsearch index %s.', config.elasticsearch.index);
                    return esclient.indices.delete({ index: config.elasticsearch.index });
                } else {
                    debug('Index %s already exists and will not be recreated. Make sure that the mapping is compatible.', config.elasticsearch.index);
                    return resp;
                }
            } else {
                debug('Index %s not found.', config.elasticsearch.index);
                return false;
            }
        }).then(function (resp) {
        // Create a new index if: 1) index was deleted in the last step 2) index didn't exist in the beginning
        if (typeof resp === 'object' && resp.acknowledged) {
            debug('Existing index %s successfully deleted. Response: %s', config.elasticsearch.index, JSON.stringify(resp));
            return esclient.indices.create({
                index: config.elasticsearch.index,
                body: settings
            });
        } else if (!resp) {
            debug('Creating index %s because it does not exist yet.', config.elasticsearch.index);
            return esclient.indices.create({
                index: config.elasticsearch.index,
                body: settings
            });
        } else {
            debug('Working with existing index %s.', config.elasticsearch.index);
            return false;
        }
    }).then(function (resp) {
        debug('Index (re)created: %s', JSON.stringify(resp));
        if (config.elasticsearch.putMappingOnStartup) {
            debug('Using mapping found in "esconfig/mapping.js" for index %s', config.elasticsearch.index);
            return esclient.indices.putMapping({ index: config.elasticsearch.index, type: config.elasticsearch.type.compendia, body: mapping });
        } else {
            debug('Not creating mapping because "putMappingOnStartup" is deactivated.');
            return false;
        }
    }).then(function (resp) {
        debug('Index and mapping configured.');
        if (typeof resp === 'object') {
            debug('Mapping successfully created. Elasticsearch response: %s', JSON.stringify(resp));
        }
        // todo implement
        debug('observer %s with API version %s waiting for requests on port %s',
            config.version,
            config.api_version,
            config.net.port);
    }).catch(function (err) {
        debug('Error creating index: %s', err);
    });
});

server.timeout = 70000;

