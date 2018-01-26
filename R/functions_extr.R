# Functions for data extraction

exportJSON = function(file, export) {
  
  sink(file)
  cat(toJSON(export, pretty = T, digits = 10))
  sink()
}

extractDependencies = function(d) {
  
  dependencies = lapply(d, function(x) if (length(x@libraries) > 0) x@libraries)
  dependencies = dependencies[!sapply(dependencies, is.null)]
  dependencies = unlist(dependencies)
  
  return(dependencies)
}

extractTextFromRmd = function(d) {
  text = processTextFile(d)
  words = unlist(strsplit(text, "\\s+"))
  return(words[grepl("^([A-Z])\\w+", words)])
}

extractText = function(d) {
  # regex for rmd code chunks: \`{3}[\s\S]*?\`{3}
  escp = paste("\"", d, "\"", sep="")
  cmd = paste("grep -o -E \'([A-Z])\\w+\'", escp, sep=" ");
  text = pipe(cmd)
  exportText = readLines(text)
  close(text)
  return((exportText))
}


processTextFile = function(filepath) {
  comment = FALSE
  txt = c()
  con = file(filepath, "r")
  while ( TRUE ) {
    line = readLines(con, n = 1)
    line = stri_escape_unicode(line)
    if ( length(line) == 0 ) {
      break
    }
    if (substr(line, 1, 3) == "```") {
      comment = TRUE
    }
    if (!comment  ) {
      txt = c(txt, line)
    }
    if (substrRight(line, 3) == "```") {
      comment = FALSE
    }
  }
  
  close(con)
  return(txt)
}

substrRight <- function(x, n){
  #printf("substr string %s, pos %s", x, n)
  substr(x, nchar(x)-n+1, nchar(x))
}


extractFunctions = function(d) {
  
  # extract slot functions
  functions = lapply(d, function(x) if (length(x@functions) > 0) names(x@functions))
  # remove NULL values
  functions = functions[!sapply(functions, is.null)]
  # flatten list
  functions = unlist(functions)
  # remove "functions" that start with special characters (keep "car.df", remove "==")
  functions = functions[!sapply(functions, function(x) grepl('[^[:alnum:]]', substring(x, 1, 1) ))]
  
  return(functions)
}

extractVariableNames = function(d) {
  
  variable_names = lapply(d, function(x) if (length(x@inputs) > 0) x@inputs)
  variable_names = variable_names[!sapply(variable_names, is.null)]
  variable_names = unlist(variable_names)
  
  return(variable_names)
}

extractGeohashes = function(d) {
  
  jarCmd = "java -jar \"../geohash_generator/target/geohash-core-1.0-SNAPSHOT-jar-with-dependencies.jar\""
  escp = paste("\"", d, "\"", sep="")
  cmd = paste(jarCmd, escp, sep = " ")
  
  command = pipe(cmd)
  geohash = fromJSON(readLines(command))
  close(command)
  return(geohash)
}

extractGeojson = function(d) {
  jsonFile <- fromJSON(d, flatten=FALSE)
  features = jsonFile$features
  
  return(features)
}