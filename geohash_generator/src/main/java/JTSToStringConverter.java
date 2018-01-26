import ch.hsr.geohash.GeoHash;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.vividsolutions.jts.geom.Geometry;
import io.github.adrianulbona.jts.discretizer.DiscretizerFactory;
import io.github.adrianulbona.jts.discretizer.DiscretizerFactoryImpl;
import io.github.adrianulbona.jts.discretizer.GeometryDiscretizer;
import org.wololo.geojson.Feature;
import org.wololo.geojson.FeatureCollection;
import org.wololo.geojson.GeoJSONFactory;
import org.wololo.jts2geojson.GeoJSONReader;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.MissingFormatArgumentException;
import java.util.Set;

public class JTSToStringConverter {

    private static final int MAX_PRECISION = 7;
    private static final int MAX_HASHES = 10000;
    private static final int MAX_HASHES_PER_FEATURE = 1000;
    private static int currentHashes = 0;

    public static void main(String[] args) throws IOException {

        String filePath;
        if(args.length > 0 && args[0] != null) {
            filePath = args[0];
            //System.out.println("Converting file " + args[0]);
        } else {
            //throw new MissingFormatArgumentException("No file path specified");
            filePath = "/home/lukas/github/explorer/inputPapers/land1slide/explorer_code/landslide.geojson";
        }

        String geojson = readFile(filePath, Charset.defaultCharset());

        /**
         * Read json compendium and extract featureColleciton / features
         */

        FeatureCollection featureCollection = (FeatureCollection) GeoJSONFactory.create(geojson);

        // parse Geometry from Feature
        GeoJSONReader reader = new GeoJSONReader();
        Feature[] features = featureCollection.getFeatures();


        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = mapper.createArrayNode();

        /**
         * Create JSON
         */

        ArrayNode geoHashArray = mapper.createArrayNode();


        for (Feature feature : features) {
            int precision = 1;

            while (precision <= MAX_PRECISION && currentHashes < MAX_HASHES) {
                geoHashArray.addAll(getGeohashesFromFeature(feature, precision));
                precision++;
            }

        }

        /**
         *  alternative options: instead of calculating bboxes for the boundary (inefficient)
         *  calculate the geohash bbox with the biggest overlap and add a score to it
         **/

        ObjectNode geoHashObjectNode = mapper.createObjectNode();
        geoHashObjectNode.putPOJO("geohashes", geoHashArray);

        /**
         * Json with geohash array
         */
        arrayNode.add(geoHashObjectNode);

        /**
         * Write to json file
         */

        //mapper.writeValue(new File("output.json"), arrayNode);

        String jsonInString = mapper.writeValueAsString(geoHashArray);

        System.out.println(jsonInString);

    }

    private static ArrayNode getGeohashesFromFeature(Feature feature, int precision) {
        GeoJSONReader reader = new GeoJSONReader();
        Geometry geometry = reader.read(feature.getGeometry());

        final DiscretizerFactory discretizerFactory = new DiscretizerFactoryImpl();
        final GeometryDiscretizer<Geometry> discretizer = discretizerFactory.discretizer(geometry);
        final Set<GeoHash> geoHashes = discretizer.apply(geometry, precision);

        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = mapper.createArrayNode();

        // Add all geohashes base32 representations to an array
        for (GeoHash geoHash : geoHashes) {
            arrayNode.add(geoHash.toBase32());
            currentHashes++;
        }

        return arrayNode;
    }

    static String readFile(String path, Charset encoding)
            throws IOException
    {
        byte[] encoded = Files.readAllBytes(Paths.get(path));
        return new String(encoded, encoding);
    }
}
