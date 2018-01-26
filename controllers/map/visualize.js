// General modules
const config = require('../../config/config');
const debug = require('debug')('explorer');
const fs = require('fs');
const path = require('path');

const url = require('url');

// standalone Elasticsearch client
const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({
    host: config.elasticsearch.location,
    log: 'info'
});

const geohash = require("ngeohash");

//explore from ID, GET
exports.visualizeFromReference = (req, res) => {

    if (typeof req.params.id === 'undefined') {
        res.status(404).send({error: 'No id provided'});
    }

    function convertToPolygon(bbox) {
        let polygon = [];
        let a = [bbox[1],bbox[0]];
        let b = [bbox[1],bbox[2]];
        let c = [bbox[3],bbox[2]];
        let d = [bbox[3],bbox[0]];
        polygon.push([a,b,c,d,a]);
        return polygon;
    }

    //replace with get
    esclient.get({
        index: config.elasticsearch.index,
        type: 'compendia',
        id: req.params.id
    }).then(function (resp) {
        debug('query successful. Got results: %s', resp.found);

        if (resp.found === false){
            res.status(500).send({error: 'no document found'});
            return;
        }

        let polygons = [];
        let geohashes = resp._source.geohashes;
        let precision = 7;
        let count = geohashes.length;

        // if zoom is active, show only polygons with specific precision level
        if (req.query.zoom) {
            geohashes = geohashes.filter(function(hash){
                return hash.length === parseInt(req.query.zoom);
            });
        } else {
            // filter geohashes based on precision
            while (geohashes.length > 5000 && precision > 3) {
                precision--;
                geohashes = geohashes.filter(element => element.length <= precision);
            }

        }


        debug('Showing %s out of %s features', geohashes.length, count);

        //remove duplicates
        let geohashesUnique = Array.from(new Set(geohashes));

        //debug('Adding geohashes %s to map.', geohashesUnique.toString());

        geohashesUnique.forEach(function(element) {
            polygons.push(convertToPolygon(geohash.decode_bbox(element)));
        });

        let popup = "Geohash " + geohashesUnique[0];

        var geojsonFeature = {
            "type": "Feature",
            "properties": {
                "stroke": "#1968ff",
                "stroke-width": 1.6,
                "stroke-opacity": 0.9,
                "fill": "#1968ff",
                "fill-opacity": 0.1,
                "name": "Visualization",
                "popupContent": popup
            },
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": polygons
            }
        };

        //Generate map
        let html = fs.readFileSync('./controllers/map/index_template.html', 'utf-8');
        html.replace('bbox', "Hello");
        //insert the locations into the html file / leaflet
        let file = html.replace('var geojsonFeature;', 'var geojsonFeature = ' + JSON.stringify(geojsonFeature) + ';');
        let indexHTMLPath = './controllers/map/index.html';
        fs.writeFile(indexHTMLPath, file, (err) => {
            if (err) {
                debug('Error writing index.html file to %s', indexHTMLPath);
                res.status(500).send({error: err});
            } else {
                debug('Sending map');
                let filePath = path.join(__dirname, 'index.html');
                res.sendFile(filePath, function(err) {
                    if (err) {
                        debug(err);
                        res.status(500).end();
                    }
                    else {
                        debug('Sent file');
                    }
                });
            }
        });


    }).catch(function (err) {
        debug('Error querying index: %s', err);
        res.status(500).send({error: err});
    });

};

