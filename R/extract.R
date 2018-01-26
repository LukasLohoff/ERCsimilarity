# readscript() -> getinputs()
library(CodeDepends)
library(knitr)

#!/usr/bin/env Rscript
#args = commandArgs(trailingOnly=TRUE)

#e = readScript(args[1])

## run with:
## Rscript --vanilla extract.R iris.R

#purl("test.Rmd", output = "test_source.R", documentation = 2)
e = readScript("test.R")

d = getInputs(e)


dependencies = lapply(d, function(x) if (length(x@libraries) > 0) x@libraries)
dependencies = dependencies[!sapply(dependencies, is.null)]
dependencies = unlist(dependencies)


# extract slot functions
functions = lapply(d, function(x) if (length(x@functions) > 0) names(x@functions))
# remove NULL values
functions = functions[!sapply(functions, is.null)]
# flatten list
functions = unlist(functions)
# remove "functions" that start with special characters (keep "car.df", remove "==")
functions = functions[!sapply(functions, function(x) grepl('[^[:alnum:]]', substring(x, 1, 1) ))]


variable_names = lapply(d, function(x) if (length(x@inputs) > 0) x@inputs)
variable_names = variable_names[!sapply(variable_names, is.null)]
variable_names = unlist(variable_names)

export = list(dependencies = dependencies, functions = functions, variable_names = variable_names)

library(jsonlite)
toJSON(export, pretty = T)


sink("export.json")
cat(toJSON(export, pretty = T))
sink()


