# from class spatialPointsDataFrame
test2 = readRDS("/home/lukas/MSC/korpus/Finished/Reconstructions of biomass burning from sediment charcoal records/GCDv03.rds")

library(rgdal)

class((test2$sp.grd[1]))

class(test2$sp.grd[[1]])

writeOGR(test2$sp.grd[[1]], "charcoal", layer="test", driver="GeoJSON")


# from dataframe to geoJSON

write.csv(wind.loc, file = "spacetime.csv")


#dataMap is a dataframe with coordinates on cols 11 (LATITUDE) and 12 (LONGITUDE)
#Transfor coordinates to numeric
wind.loc$LATITUDE  <- as.numeric(wind.loc$Latitude)
wind.loc$LONGITUDE  <- as.numeric(wind.loc$Longitude)
dataMap.SP  <- SpatialPointsDataFrame(dataMap[,c(12,11)],dataMap[,-c(12,11)])
str(dataMap.SP) # Now is class SpatialPointsDataFrame

#Write as geojson
writeOGR(dataMap.SP, 'dataMap.geojson','dataMap', driver='GeoJSON')

library(ncdf4)
nc = nc_open("/home/lukas/MSC/korpus/Finished/Retrieval algorithm for rainfall mapping from microwave links in a/RAINLINK-master/Radar5min/RAD_NL25_RAC_MFBS_5min_201109100805.nc")





precip = list()
precip$x = ncvar_get(nc, "x")
precip$y = ncvar_get(nc, "y")



library(raster)

precip$z = ncvar_get(nc, "image1_image_data", start=c(1, 1, 1), count=c(-1, -1, 1))
# Convert to a raster if required
precip.r = raster(precip)


