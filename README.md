## ERC similarity explorer

Exploration of research compendia

### Dependencies

- Elasticsearch 6.1.1 on port 9200
- R and the R packages:
	- CodeDepends 0.5-5.1 (https://github.com/duncantl/CodeDepends) 
	- knitR
	- tools
	- jsonlite
	- stringr
	- stringi
	- (gstat, plm, metafor)
	
- Java 1.8
- NodeJS >= 8.9
- npm >= 5.5
- gs (ghostscript)
- Maven

Some commands (`gs` and `grep`  in the script `extract_all.R` and `functions_extr.R` may have to be adjusted if anything other than Ubuntu 16.04 is used.

### Installation

Build:

	cd ERCsimilarity

	npm install

	cd geohash_generator

	mvn clean compile assembly:single
		
**Important**: After this make sure the path to your *geohash_generator* JAR matches the path in the extraction functions `functions_extr.R` on line 92

### Usage

Note: The steps 0), 1) and 2) are optional and can be skipped by directly providing JSON files with the extracted *functions*, *dependencies*, *variable_names* and *geohashes*

The two existing papers probably won't be enough to get similarity scores and visualize matrices. Recommended are 10-20 papers.

0) Get a set of research papers including source code and spatial data and prepare them in the same way as the papers in the `inputPapers` directory. 


1) The R script `extract_preprocess.R` can be used to convert Rmd files to R files and PDF files to txt files. For the two example ERCs in `inputPapers` this has already been done

2) Delete the precomputed files in `outputDir` and then extract code and spatial data by running the script `extract_all.R`. This should create JSON files with dependencies, functions, variable names and geohashes.

3) Start elasticsearch on port 9200 with the config from this repository:

 `bin/elasticsearch -Epath.conf=~/github/explorer/esconfig`
 
3.5) Make sure no index with the name `explorer` exists
 
4) Start the  explorer on port 8090: 

`DEBUG=* npm start`

5) Upload all generated JSON files by calling `/api/v1/bulk/<path>`, with the absolute or relative path to the generated files, e.g. 

`GET /api/v1/bulk?path=R/outputDir`

6) Generate matrices by calling 

`/api/v1/matrix` and `/api/v1/matrix?type=spatial`

Get a list of similar papers by calling the `/api/v1/explore` endpoint:

`GET http://localhost:8090/api/v1/explore/hurricane.json`

6.5) Explore the geohash representation by using the endpoit `/api/v1/visualize/ID`, e.g. 

`http://localhost:8090/api/v1/visualize/hydrologicalModeling.json`

7) To run the visualization, save the matrices into the `results` folder with the filenames specified in `R/generateVisualization.R`

8) Run the R script `R/generateVisualization.R` to generate figures


### Useful commands


#### Delete index

`curl -XDELETE 'localhost:9200/explorer?pretty'`

#### Upload

`POST http://localhost:8090/api/v1/upload` with the document as the body

The document will get a random id.

#### Upload bulk

`http://localhost:8090/api/v1/bulk/?path=R/outputDir`

For this, some JSON documents have to be in in `explorer/R/outputDir`

The documents will take the filename as ID.


#### Generate similarity matrix

`http://localhost:8090/api/v1/matrix?type=code`

All supported similarity types:

- `spatial`
- `code`
- `text`
- `functions`
- `variable_names`
- `dependencies`
- `all`

### Tests

### Running the CLI geohash converter directly ...

`java -jar geohash-core-1.0-SNAPSHOT-jar-with-dependencies.jar "<path-to-geojson-file>"`

... will return a string with the geohashes, e.g. `["9", "c", "d", "e", "f", "g", "ee", "dj", "dg", "de"]`
