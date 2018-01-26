# Title     : extract_all
# Objective : extract all source code information from a directory of multiple workspaces
# Created by: lukas lohoff
# Created on: 12.10.17

library(knitr)
library(CodeDepends)
library(tools)
library(jsonlite)
library(stringr)
library(stringi)

# dependencies for certain scripts, needed for codeDepends to complete
library(gstat)
library(plm)
library(metafor)

# set the working directory to the location of this file, e.g
# setwd(paste(Sys.getenv("HOME"), "/github/explorer/R", sep=""))

# Load help functions for matrix cleanup and generation
source("functions_extr.R")

# make sure the working directory is equal to the script's location (e.g. /home/$USER/github/explorer/R)

files <- list.files(path="../inputPapers", full.names=T, recursive=FALSE)

rsourceDir = "explorer_code"

printf <- function(...) invisible(print(sprintf(...)))

# 1. extract dependencies from all R files
lapply(files, function(x) {
  printf("Reading directory %s", x)
  codeDir = file.path(x, rsourceDir) 
  subfiles <- list.files(path=codeDir, full.names=T, recursive=FALSE)
  
  doctext =  character()
  dependencies =  character()
  functions =  character()
  variable_names =  character()
  geohashes = character()
  geojson =  character()
  hasTextFile = FALSE
  
  lapply(subfiles, function(z) {
    if (file_ext(z) == "txt") {
      hasTextFile <<- TRUE
      }
  })
  
  printf("directory has text file: %s", hasTextFile)
  
  lapply(subfiles, function(y) {
    if (file_ext(y) == "R") {
      printf("Processing file %s", y)

      e = readScript(y)
      # parse R code with CodeDepends
      d = getInputs(e)

      # extract parts and combine them with the rest
      dependencies <<- c(dependencies, extractDependencies(d))
      functions <<- c(functions, extractFunctions(d))
      variable_names <<- c(variable_names, extractVariableNames(d))
    }
    
    #convert spatial information into geohashes
    if (file_ext(y) == "geojson") {
      printf("Processing spatial file %s", y)

      # extract parts and combine them with the rest
      geohashes <<- c(geohashes, extractGeohashes(y))
      #geojson <<- extractGeojson(y)
    }
    
    if (file_ext(y) == "txt") {
      printf("Processing txt file %s", y)
      doctext <<- c(doctext, extractText(y))
      hasTextFile = TRUE
    }
    
    if (file_ext(y) == "Rmd" && !hasTextFile) {
      printf("Processing Rmd text file %s", y)
      doctext <<- c(doctext, extractTextFromRmd(y))
    }
    
    
  })
  ## combine dependencies, functions and varible_names to one single list
  ## x = rscripts/A Bayesian posterior predictive framework for weighting ensemble
  outputName <- paste("outputDir/", basename(x), ".json", sep = "")
  # todo: add geohashes
  exportJSON(outputName, list(text = unlist(doctext),
                              dependencies = unlist(dependencies),
                              functions = unlist(functions),
                              variable_names = unlist(variable_names),
                              geohashes = unlist(geohashes)
                              #geojson = geojson
                              ))
  
})