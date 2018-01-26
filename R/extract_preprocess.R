
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

# set the working directory to the location of this file
# setwd(paste(Sys.getenv("HOME"), "/github/explorer/R", sep=""))

# Load help functions for matrix cleanup and generation
source("functions_extr.R")

# make sure the working directory is equal to the script's location (e.g. /home/$USER/github/explorer/R)

files <- list.files(path="../inputPapers", full.names=T, recursive=FALSE)

rsourceDir = "explorer_code"

printf <- function(...) invisible(print(sprintf(...)))

# 0. remove comments

#library(formatR)
#tidy_source(source="rscripts/Global sensitivity analysis of the Indian monsoon during the Pleistocene/explorer_code/optim_lambda_tmp.R", keep.comment=FALSE)

# 1. preprocessing: convert Rmd files to R files and PDF files to text files
lapply(files, function(x) {
  codeDir = file.path(x, rsourceDir)
  subfiles <- list.files(path=codeDir, full.names=T, recursive=FALSE)
  
  lapply(subfiles, function(y) {
    
    # if (file_ext(y) == "Rmd") {
    #   baseName = file_path_sans_ext(y)
    #   tempFile = paste(baseName, "_fttemp.R", sep = "")
    #   purl(y, output = tempFile, documentation = 2)
    # } 
    
    if (file_ext(y) == "pdf") {
      baseName = file_path_sans_ext(y)
      tempFile = paste(baseName, "_temp.txt", sep = "")
      escpTempFile = paste("\"", tempFile, "\"", sep="")
      escp = paste("\"", y, "\"", sep="")
      
      cmd = paste("gs -sDEVICE=txtwrite -o", escpTempFile, escp, sep = " ")
      system(cmd)
    } 
    
  })
})