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

const similarity = 'my_IB';
const analyzer = 'keyword';
const termVector = 'yes';

const mapping = {
    "compendia": {
        // "_source": {
        //     "excludes": [
        //         "geojson.properties"
        //     ]
        // },
        "properties": {
            "dependencies": {
                "type": "text",
                "similarity": similarity,
                "fields": {
                    "raw": {
                        "type": "text",
                        "analyzer": analyzer,
                        "term_vector": termVector
                    }
                }
            },
            "variable_names": {
                "type": "text",
                "similarity": similarity,
                "fields": {
                    "raw": {
                        "type": "text",
                        "analyzer": analyzer,
                        "term_vector": termVector
                    }
                }
            },
            "functions": {
                "type": "text",
                "similarity": similarity,
                "fields": {
                    "raw": {
                        "type": "text",
                        "analyzer": analyzer,
                        "term_vector": termVector
                    }
                }
            },
            "text": {
                "type": "text",
                "similarity": similarity,
                "fields": {
                    "raw": {
                        "type": "text",
                        "analyzer": analyzer,
                        "term_vector": termVector
                    }
                }
            },
            "geohashes": {
                "type": "text",
                "similarity": similarity,
                "fields": {
                    "raw": {
                        "type": "text",
                        "analyzer": analyzer,
                        "term_vector": termVector
                    }
                }
            }
            // "geojson": {
            //     "properties": {
            //         "geometry": {
            //             "type": "geo_shape",
            //             "tree": "quadtree"
            //         },
            //         "properties": {
            //             "type": "object",
            //             "enabled": false,
            //             "include_in_all": false
            //         }
            //     }
            // }
        }
    }
};

module.exports = mapping;