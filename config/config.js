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
var c = {};
c.version = {};
c.net = {};
c.elasticsearch = {};
var env = process.env;

// Information about explorer
c.version = require('../package.json').version;
c.api_version = 1;

// network & databases
c.net.port = env.observer_PORT || 8090;

c.elasticsearch.index = env.observer_ELASTICSEARCH_INDEX || 'explorer';
c.elasticsearch.deleteIndexOnStartup = false;
c.elasticsearch.putMappingOnStartup = true;
c.elasticsearch.type = {};
c.elasticsearch.type.compendia = env.observer_ELASTICSEARCH_TYPE_COMPENDIA || 'compendia';
c.elasticsearch.type.jobs = env.observer_ELASTICSEARCH_TYPE_JOBS || 'jobs';

c.elasticsearch.location = env.ELASTIC_SEARCH_URL || 'http://localhost:9200';

c.elasticsearch.include = true; //include queried document in MLT results
c.elasticsearch.searchSize = 45;

c.elasticsearch.mlt = {};
c.elasticsearch.mlt.max_query_terms = 50000; //default 25
c.elasticsearch.mlt.min_term_freq = 1; //default 2
c.elasticsearch.mlt.min_doc_freq = 1; //default 5
c.elasticsearch.mlt.max_doc_freq = 300; //default 0
c.elasticsearch.mlt.minimum_should_match = "0%"; //default 30%
c.elasticsearch.mlt.min_word_length = 2;
c.elasticsearch.mlt.max_word_length = 20;
c.elasticsearch.mlt.stop_words = ["length", "data.frame", "for", "if", "return", "list", "print", "the"];

// fs paths
c.fs = {};
c.fs.base = env.FILE_BASEPATH || '/tmp/o2r/';
c.fs.compendium = c.fs.base + 'compendium/';
c.fs.geojson = c.fs.base + 'geojson/';

c.id_length = 5;

module.exports = c;
