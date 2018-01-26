## HELP FUNCTIONS

normalit<-function(m){
  (m - min(m))/(max(m)-min(m))
}


dfToMatrix = function(dataframe, paperlist, axis.NA = c(FALSE, TRUE)) {
  shortlist = c()
  for (i in 1:length(paperlist)) {
    shortlist = c(shortlist, substr(paperlist[i], 1, 5) )
  }
  
  vec = c()
  for (i in 1:length(paperlist)) {
    currPaper = paperlist[i]
    
    currRow = subset(dataframe, id == currPaper)
    
    
    for (k in 1:length(paperlist)){
      rowPaper = paperlist[k]
      valueDF = subset(currRow$row[[1]], id == rowPaper)
      if (axis.NA && k == i) { # if the value is for the paper itself set to NA
        vec = c(vec, valueDF$score*0.2)
        #vec = c(vec, NA)
        
      } else {
        score = valueDF$score
        if (logscoring == TRUE && log(score) > 1) {
          score = log(score)
        }
        vec = c(vec, score)
      }
    }
  }
  ma <- matrix(vec, nrow = length(paperlist), byrow = FALSE, dimnames = list(shortlist, shortlist))
  
  #, dimnames = list(paperlist, paperlist)
  
  return(ma)
}


fillJSONMatrix = function(dataframe) {
  matrix = dataframe
  papersSpatial = dataframe$id
  
  for (i in 1:length(dataframe$row)) {
    scores = dataframe$row[[i]]
    
    for (k in 1:length(papersSpatial)) {
      paper = papersSpatial[k]
      if (!is.element(paper, scores$id)) {
        de<-data.frame(paper,0)
        names(de)<-c("id","score")
        
        scores <- rbind(scores, de)
      }
    }
    dataframe$row[[i]] = scores
  }
  return(dataframe)
}