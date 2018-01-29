library(jsonlite)
library(ggplot2)
library(corrplot)
library(matlab)

# set the working directory to the location of this file
# setwd(paste(Sys.getenv("HOME"), "/github/explorer/R", sep=""))

# Load help functions for matrix cleanup and generation
source("functions_vis.R")

matrix_text_classic <- fillJSONMatrix(fromJSON("../results/matrix_text_classic_cleanup.json", flatten=FALSE))
matrix_text_BM25 <- fillJSONMatrix(fromJSON("../results/matrix_text_BM25_cleanup.json", flatten=FALSE))
matrix_text_DFR <- fillJSONMatrix(fromJSON("../results/matrix_text_DFR_cleanup.json", flatten=FALSE))
matrix_text_IB <- fillJSONMatrix(fromJSON("../results/matrix_text_IB_cleanup.json", flatten=FALSE))

matrix_code_classic <- fillJSONMatrix(fromJSON("../results/matrix_code_classic_cleanup.json", flatten=FALSE))
matrix_code_BM25 <- fillJSONMatrix(fromJSON("../results/matrix_code_BM25_cleanup.json", flatten=FALSE))
matrix_code_DFR <- fillJSONMatrix(fromJSON("../results/matrix_code_DFR_cleanup.json", flatten=FALSE))
matrix_code_IB <- fillJSONMatrix(fromJSON("../results/matrix_code_IB_cleanup.json", flatten=FALSE))

matrix_spatial_IB <- fillJSONMatrix(fromJSON("../results/matrix_spatial_IB.json", flatten=FALSE))
matrix_spatial_BM25 <- fillJSONMatrix(fromJSON("../results/matrix_spatial_BM25.json", flatten=FALSE))
matrix_spatial_DFR <- fillJSONMatrix(fromJSON("../results/matrix_spatial_DFR.json", flatten=FALSE))
matrix_spatial_classic <- fillJSONMatrix(fromJSON("../results/matrix_spatial_classic.json", flatten=FALSE))

# create lists with dinames for both normal and spatial matrices
codelist = matrix_text_classic$id
spatiallist = matrix_spatial_classic$id

col3 <- colorRampPalette(c("red", "white", "blue")) 


# Step 2.1: Convert normal datasets to matrices
logscoring = FALSE

M.IB.text = dfToMatrix(matrix_text_IB, codelist, axis.NA = TRUE)
M.BM25.text = dfToMatrix(matrix_text_BM25, codelist, axis.NA = TRUE)
M.classic.text = dfToMatrix(matrix_text_classic, codelist, axis.NA = TRUE)
M.DFR.text = dfToMatrix(matrix_text_DFR, codelist, axis.NA = TRUE)

M.IB.code = dfToMatrix(matrix_code_IB, codelist, axis.NA = TRUE)
M.BM25.code = dfToMatrix(matrix_code_BM25, codelist, axis.NA = TRUE)
M.classic.code = dfToMatrix(matrix_code_classic, codelist, axis.NA = TRUE)
M.DFR.code = dfToMatrix(matrix_code_DFR, codelist, axis.NA = TRUE)


logscoring = TRUE

M.IB.spatial = dfToMatrix(matrix_spatial_IB, spatiallist, axis.NA = FALSE)
M.BM25.spatial = dfToMatrix(matrix_spatial_BM25, spatiallist, axis.NA = FALSE)
M.classic.spatial = dfToMatrix(matrix_spatial_classic, spatiallist, axis.NA = FALSE)
M.DFR.spatial = dfToMatrix(matrix_spatial_DFR, spatiallist, axis.NA = FALSE)

# Correlation plots:

# Source code
title = "Source Code Similarity Matrix, IB"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.IB.code, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
         )
dev.off()

title = "Source Code Similarity Matrix, classic"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.classic.code, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


title = "Source Code Similarity Matrix, DFR"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.DFR.code, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


title = "Source Code Similarity Matrix, BM25"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.BM25.code, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


# Text
title = "Text Similarity Matrix, IB"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.IB.text, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


title = "Text Similarity Matrix, classic"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.classic.text, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


title = "Text Similarity Matrix, DFR"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.DFR.text, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


title = "Text Similarity Matrix, BM25"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.BM25.text, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


# Spatial

title = "Spatial Similarity Matrix, IB"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.IB.spatial, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


title = "Spatial Similarity Matrix, classic"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.classic.spatial, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


title = "Spatial Similarity Matrix, DFR"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.DFR.spatial, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


title = "Spatial Similarity Matrix, BM25"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.BM25.spatial, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()




# Step 2.1.2: Create subset for code similarity to compare with spatial similarity

logscoring = TRUE

M.IB.text.subset = dfToMatrix(matrix_text_IB, spatiallist, axis.NA = FALSE)
M.BM25.text.subset = dfToMatrix(matrix_text_BM25, spatiallist, axis.NA = FALSE)
M.classic.text.subset = dfToMatrix(matrix_text_classic, spatiallist, axis.NA = FALSE)
M.DFR.text.subset = dfToMatrix(matrix_text_DFR, spatiallist, axis.NA = FALSE)

M.IB.code.subset = dfToMatrix(matrix_code_IB, spatiallist, axis.NA = FALSE)
M.BM25.code.subset = dfToMatrix(matrix_code_BM25, spatiallist, axis.NA = FALSE)
M.classic.code.subset = dfToMatrix(matrix_code_classic, spatiallist, axis.NA = FALSE)
M.DFR.code.subset = dfToMatrix(matrix_code_DFR, spatiallist, axis.NA = FALSE)


# 2.1.3 plot subsets

# Source code
title = "Source Code Similarity Matrix, Subset, IB"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.IB.code.subset, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()

# Text
title = "Text Similarity Matrix, Subset, IB"
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)
corrplot(M.IB.text.subset, is.corr = FALSE,
         order = "hclust", 
         na.label = "o",
         title=title,
         mar=c(0,0,1,0)
)
dev.off()


# Step 3: Analyzing matrices

# 3.1 matrix plots

# Comparing text, code and spatial similarity

tempshortlist = c("text", "code", "spatial")
title = "Text vs. Code vs. Spatial Similarity, IB"

# Plot
pdf(paste("plots/", title, ".pdf", sep = ""), width = 7.84, height = 7.34)

matCor = c(cor(c(M.IB.text.subset), c(M.IB.text.subset)),
           cor(c(M.IB.text.subset), c(M.IB.code.subset)),
           cor(c(M.IB.text.subset), c(M.IB.spatial)),
           cor(c(M.IB.code.subset), c(M.IB.text.subset)),
           cor(c(M.IB.code.subset), c(M.IB.code.subset)),
           cor(c(M.IB.code.subset), c(M.IB.spatial)),
           cor(c(M.IB.spatial), c(M.IB.text.subset)),
           cor(c(M.IB.spatial), c(M.IB.code.subset)),
           cor(c(M.IB.spatial), c(M.IB.spatial))
           )

mat <- matrix(matCor, nrow = 3, byrow = FALSE, dimnames = list(tempshortlist, tempshortlist))
corrplot(mat, title=title,
         mar=c(0,0,1,0))
dev.off()


title = "Text vs. Spatial Similarity, IB"
d3cor = cor(M.IB.text.subset, M.IB.spatial)
corrplot(d3cor, title=title,
         order = "hclust",
         mar=c(0,0,1,0))


# Comparing different algorithms

tempshortlist = c("IB", "classic", "DFR", "BM25")
title = "IB vs. classic vs. DFR vs. BM25"

matAlgorithmCor = c(cor(c(M.IB.text), c(M.IB.text)),
           cor(c(M.IB.text), c(M.classic.text)),
           cor(c(M.IB.text), c(M.DFR.text)),
           cor(c(M.IB.text), c(M.BM25.text)),
           
           cor(c(M.classic.text), c(M.IB.text)),
           cor(c(M.classic.text), c(M.classic.text)),
           cor(c(M.classic.text), c(M.DFR.text)),
           cor(c(M.classic.text), c(M.BM25.text)),
           
           cor(c(M.DFR.text), c(M.IB.text)),
           cor(c(M.DFR.text), c(M.classic.text)),
           cor(c(M.DFR.text), c(M.DFR.text)),
           cor(c(M.DFR.text), c(M.BM25.text)),
           
           cor(c(M.BM25.text), c(M.IB.text)),
           cor(c(M.BM25.text), c(M.classic.text)),
           cor(c(M.BM25.text), c(M.DFR.text)),
           cor(c(M.BM25.text), c(M.BM25.text))
)

# Plot

pdf(paste("plots/", title, ".pdf", sep = ""), width = 4, height = 4.2)
matAlgorithm <- matrix(matAlgorithmCor, nrow = 4, byrow = FALSE, dimnames = list(tempshortlist, tempshortlist))
corrplot(matAlgorithm, title=title
         #mar=c(0,0,-1,0)
         #col=color,
         #,is.corr = FALSE
         )

dev.off()









