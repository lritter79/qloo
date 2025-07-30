OUTPUT_PARAMS = {
    # Diversification parameters
    "diversify_by": "diversify.by",
    "diversify_take": "diversify.take",

    # Feature parameters
    "feature_explainability": "feature.explainability",

    # Pagination parameters
    "offset": "offset",
    "page": "page",
    "take": "take",

    # Output format parameters
    "output_heatmap_boundary": "output.heatmap.boundary",

    # Sorting parameters
    "sort_by": "sort_by"
}
SIGNAL_PARAMS = {
    # Bias parameters
    "bias_trends": "bias.trends",

    # Demographics signals
    "signal_demographics_audiences": "signal.demographics.audiences",
    "signal_demographics_audiences_weight": "signal.demographics.audiences.weight",
    "signal_demographics_age": "signal.demographics.age",
    "signal_demographics_gender": "signal.demographics.gender",

    # Interest signals - entities
    "signal_interests_entities": "signal.interests.entities",
    "signal_interests_entities_query": "signal.interests.entities.query",

    # Interest signals - tags
    "signal_interests_tags": "signal.interests.tags",
    "operator_signal_interests_tags": "operator.signal.interests.tags",

    # Location signals
    "signal_location": "signal.location",
    "signal_location_query": "signal.location.query",
    "signal_location_radius": "signal.location.radius"
}
FILTER_PARAMS = {
    "filter_type": "filter.type",
    # Address filters
    "filter_address": "filter.address",

    # Audience filters
    "filter_audience_types": "filter.audience.types",

    # Content rating filters
    "filter_content_rating": "filter.content_rating",

    # Date of birth filters
    "filter_date_of_birth_max": "filter.date_of_birth.max",
    "filter_date_of_birth_min": "filter.date_of_birth.min",

    # Date of death filters
    "filter_date_of_death_max": "filter.date_of_death.max",
    "filter_date_of_death_min": "filter.date_of_death.min",

    # Entity filters
    "filter_entities": "filter.entities",
    "filter_exclude_entities": "filter.exclude.entities",
    "filter_exclude_entities_query": "filter.exclude.entities.query",

    # Tag filters
    "filter_exclude_tags": "filter.exclude.tags",
    "operator_exclude_tags": "operator.exclude.tags",

    # External filters
    "filter_external_exists": "filter.external.exists",
    "operator_filter_external_exists": "operator.filter.external.exists",

    # Resy filters
    "filter_external_resy_count_max": "filter.external.resy.count.max",
    "filter_external_resy_count_min": "filter.external.resy.count.min",
    "filter_external_resy_party_size_max": "filter.external.resy.party_size.max",
    "filter_external_resy_party_size_min": "filter.external.resy.party_size.min",
    "filter_external_resy_rating_max": "filter.external.resy.rating.max",
    "filter_external_resy_rating_min": "filter.external.resy.rating.min",

    # TripAdvisor filters
    "filter_external_tripadvisor_rating_count_max": "filter.external.tripadvisor.rating.count.max",
    "filter_external_tripadvisor_rating_count_min": "filter.external.tripadvisor.rating.count.min",
    "filter_external_tripadvisor_rating_max": "filter.external.tripadvisor.rating.max",
    "filter_external_tripadvisor_rating_min": "filter.external.tripadvisor.rating.min",

    # TV Show filters
    "filter_finale_year_max": "filter.finale_year.max",
    "filter_finale_year_min": "filter.finale_year.min",

    # Gender filters
    "filter_gender": "filter.gender",

    # Geocode filters
    "filter_geocode_admin1_region": "filter.geocode.admin1_region",
    "filter_geocode_admin2_region": "filter.geocode.admin2_region",
    "filter_geocode_country_code": "filter.geocode.country_code",
    "filter_geocode_name": "filter.geocode.name",

    # Hotel class filters
    "filter_hotel_class_max": "filter.hotel_class.max",
    "filter_hotel_class_min": "filter.hotel_class.min",

    # Hours filters
    "filter_hours": "filter.hours",

    # ID filters
    "filter_ids": "filter.ids",

    # Latest known year filters
    "filter_latest_known_year_max": "filter.latest_known_year.max",
    "filter_latest_known_year_min": "filter.latest_known_year.min",

    # Location filters
    "filter_location": "filter.location",
    "filter_exclude_location": "filter.exclude.location",
    "filter_location_query": "filter.location.query",
    "filter_exclude_location_query": "filter.exclude.location.query",
    "filter_location_geohash": "filter.location.geohash",
    "filter_exclude_location_geohash": "filter.exclude.location.geohash",
    "filter_location_radius": "filter.location.radius",

    # Parents filters
    "filter_parents_types": "filter.parents.types",

    # Popularity filters
    "filter_popularity_max": "filter.popularity.max",
    "filter_popularity_min": "filter.popularity.min",

    # Price level filters
    "filter_price_level_max": "filter.price_level.max",
    "filter_price_level_min": "filter.price_level.min",

    # Price range filters
    "filter_price_range_from": "filter.price_range.from",
    "filter_price_range_to": "filter.price_range.to",

    # Business rating filters
    "filter_properties_business_rating_max": "filter.properties.business_rating.max",
    "filter_properties_business_rating_min": "filter.properties.business_rating.min",

    # Publication year filters
    "filter_publication_year_max": "filter.publication_year.max",
    "filter_publication_year_min": "filter.publication_year.min",

    # Rating filters
    "filter_rating_max": "filter.rating.max",
    "filter_rating_min": "filter.rating.min",

    # Brand references filters
    "filter_references_brand": "filter.references_brand",

    # Release country filters
    "filter_release_country": "filter.release_country",
    "operator_filter_release_country": "operator.filter.release_country",

    # Release date filters
    "filter_release_date_max": "filter.release_date.max",
    "filter_release_date_min": "filter.release_date.min",

    # Release year filters
    "filter_release_year_max": "filter.release_year.max",
    "filter_release_year_min": "filter.release_year.min",

    # Results filters
    "filter_results_entities": "filter.results.entities",
    "filter_results_entities_query": "filter.results.entities.query",

    # Tag type filters
    "filter_tag_types": "filter.tag.types",

    # Tags filters
    "filter_tags": "filter.tags",
    "operator_filter_tags": "operator.filter.tags",

}

FILTER_PARAM_DESCRIPTIONS = {
    "filter_type": "Filter by the entity type to return. An example value is (urn:entity:place), but it can also be a brand, artist, place, book, destination, podcast, videogame, movie, or tv show. This is required for all queries.",
    "filter_address": "Filter by address using a partial string query.",
    "filter_audience_types": "Filter by a list of audience types.",
    "filter_content_rating": "Filter by a comma-separated list of content ratings based on the MPAA film rating system, which determines suitability for various audiences.",
    "filter_date_of_birth_max": "Filter by the most recent date of birth desired for the queried person.",
    "filter_date_of_birth_min": "Filter by the earliest date of birth desired for the queried person.",
    "filter_date_of_death_max": "Filter by the most recent date of death desired for the queried person.",
    "filter_date_of_death_min": "Filter by the earliest date of death desired for the queried person.",
    "filter_entities": "Filter by a comma-separated list of entity IDs. Often used to assess the affinity of an entity towards input.",
    "filter_exclude_entities": "A comma-separated list of entity IDs to remove from the results.",
    "filter_exclude_entities_query": "This parameter can only be supplied when using POST HTTP method, since it requires JSON encoded body. The value for filter.exclude.entities.query is a JSON array with objects containing the name and address properties. For a fuzzier search, just include an array of strings. When supplied, it overwrites the filter.exclude.entities object with resolved entity IDs. The response will contain a path query.entities.exclude, with partial Qloo entities that were matched by the query. If no entities are found, the API will throw a 400 error.",
    "filter_exclude_tags": "Exclude entities associated with a comma-separated list of tags.",
    "operator_exclude_tags": "Specifies how multiple filter.exclude.tags values are combined in the query. Use \"union\" (equivalent to a logical \"or\") to exclude results that contain at least one of the specified tags, or \"intersection\" (equivalent to a logical \"and\") to exclude only results that contain all specified tags. The default is \"union\".",
    "filter_external_exists": "Filter by a comma-separated list of external keys. (resy|michelin|tablet).",
    "operator_filter_external_exists": "Specifies how multiple filter.external.exists values are combined in the query. Use \"union\" (equivalent to a logical \"or\") to return results that match at least one of the specified external keys (e.g., resy, michelin, or tablet), or \"intersection\" (equivalent to a logical \"and\") to return only results that match all specified external keys. The default is \"union\".",
    "filter_external_resy_count_max": "Filter places to include only those with a Resy rating count less than or equal to the specified maximum. Applies only to entities with filter.type of urn:entity:place.",
    "filter_external_resy_count_min": "Filter places to include only those with a Resy rating count greater than or equal to the specified minimum. Applies only to entities with filter.type of urn:entity:place.",
    "filter_external_resy_party_size_max": "Filter by the maximum supported party size required for a Point of Interest.",
    "filter_external_resy_party_size_min": "Filter by the minimum supported party size required for a Point of Interest.",
    "filter_external_resy_rating_max": "Filter places to include only those with a Resy rating less than or equal to the specified maximum (1–5 scale). Applies only to entities with filter.type of urn:entity:place.",
    "filter_external_resy_rating_min": "Filter places to include only those with a Resy rating greater than or equal to the specified minimum (1–5 scale). Applies only to entities with filter.type of urn:entity:place.",
    "filter_external_tripadvisor_rating_count_max": "Filter places to include only those with a Tripadvisor review count less than or equal to the specified maximum. This filter only applies to entities with filter.type of urn:entity:place.",
    "filter_external_tripadvisor_rating_count_min": "Filter places to include only those with a Tripadvisor review count greater than or equal to the specified minimum. This filter only applies to entities with filter.type of urn:entity:place.",
    "filter_external_tripadvisor_rating_max": "Filter places to include only those with a Tripadvisor rating less than or equal to the specified maximum. This filter only applies to entities with filter.type of urn:entity:place.",
    "filter_external_tripadvisor_rating_min": "Filter places to include only those with a Tripadvisor rating greater than or equal to the specified minimum. This filter only applies to entities with filter.type of urn:entity:place.",
    "filter_finale_year_max": "Filter by the latest desired year for the final season of a TV show.",
    "filter_finale_year_min": "Filter by the earliest desired year for the final season of a TV show.",
    "filter_gender": "Filter results to align with a specific gender identity. Used to personalize output based on known or inferred gender preferences.",
    "filter_geocode_admin1_region": "Filter by properties.geocode.admin1_region. Exact match (usually state).",
    "filter_geocode_admin2_region": "Filter by properties.geocode.admin2_region. Exact match (often county or borough).",
    "filter_geocode_country_code": "Filter by properties.geocode.country_code. Exact match (two-letter country code).",
    "filter_geocode_name": "Filter by properties.geocode.name. Exact match (usually city or town name).",
    "filter_hotel_class_max": "Filter by the maximum desired hotel class (1-5, inclusive).",
    "filter_hotel_class_min": "Filter by the minimum desired hotel class (1-5, inclusive).",
    "filter_hours": "Filter by the day of the week the Point of Interest must be open (Monday, Tuesday, etc.).",
    "filter_ids": "Filter by a comma-separated list of audience IDs.",
    "filter_latest_known_year_max": "Filter by a certain maximum year that shows were released or updated.",
    "filter_latest_known_year_min": "Filter by a certain minimum year that shows were released or updated.",
    "filter_location": "Filter by a WKT POINT, POLYGON, MULTIPOLYGON or a single Qloo ID for a named urn:entity:locality. WKT is formatted as X then Y, therefore longitude is first (POINT(-73.99823 40.722668)). If a Qloo ID or WKT POLYGON is passed, filter.location.radius will create a fuzzy boundary when set to a value > 0.",
    "filter_exclude_location": "Exclude results that fall within a specific location, defined by either a WKT POINT, POLYGON, MULTIPOLYGON, or a Qloo ID for a named urn:entity:locality. WKT is formatted with longitude first (e.g., POINT(-73.99823 40.722668)). When using a locality ID or a WKT POLYGON, setting filter.location.radius to a value > 0 creates a fuzzy exclusion boundary.",
    "filter_location_query": "A query used to search for one or more named urn:entity:locality Qloo IDs for filtering requests, equivalent to passing the same Locality Qloo ID(s) into filter.location. For GET requests: Provide a single locality query as a string. For POST requests: You can still send a single locality as a string. Or you can send an array of locality names to query multiple localities at once. When multiple localities are provided, their geographic shapes are merged, and the system returns results with the highest affinities across the combined area. Locality queries are fuzzy-matched and case-insensitive. Examples include New York City, Garden City, New York, Los Angeles, Lower East Side, and AKAs like The Big Apple. When a single locality is supplied, the response JSON includes query.locality.signal with the matched Qloo entity. If multiple are supplied, this field is omitted. By default, the API includes a tuning that also captures nearby entities just outside the official boundaries of the locality. To turn this off and limit results strictly to within the locality, set filter.location.radius=0. If no localities are found, the API returns a 400 error.",
    "filter_exclude_location_query": "Exclude results that fall within a specific location, defined by either a WKT POINT, POLYGON, MULTIPOLYGON, or a Qloo ID for a named urn:entity:locality. WKT is formatted with longitude first (e.g., POINT(-73.99823 40.722668)). When using a locality ID or a WKT POLYGON, setting filter.location.radius to a value > 0 creates a fuzzy exclusion boundary.",
    "filter_location_geohash": "Filter by a geohash. Geohashes are generated using the Python package pygeohash with a precision of 12 characters. This parameter returns all POIs that start with the specified geohash. For example, supplying dr5rs would allow returning the geohash dr5rsjk4sr2w.",
    "filter_exclude_location_geohash": "Exclude all entities whose geohash starts with the specified prefix. Geohashes are generated using the Python package pygeohash with a precision of 12 characters. For example, supplying dr5rs would exclude any result whose geohash begins with dr5rs, such as dr5rsjk4sr2w.",
    "filter_location_radius": "Filter by the radius (in meters) when also supplying filter.location or filter.location.query. When this parameter is not provided, the API applies a default tuning that slightly expands the locality boundary to include nearby entities outside its official shape. To disable this behavior and strictly limit results to entities inside the defined locality boundary, set filter.location.radius=0.",
    "filter_parents_types": "Filter by a comma-separated list of parental entity types (urn:entity:place). Each type must match exactly.",
    "filter_popularity_max": "Filter by the maximum popularity percentile a Point of Interest must have (float, between 0 and 1; closer to 1 indicates higher popularity, e.g., 0.98 for the 98th percentile).",
    "filter_popularity_min": "Filter by the minimum popularity percentile required for a Point of Interest (float, between 0 and 1; closer to 1 indicates higher popularity, e.g., 0.98 for the 98th percentile).",
    "filter_price_level_max": "Filter by the maximum price level a Point of Interest can have (1|2|3|4, similar to dollar signs).",
    "filter_price_level_min": "Filter by the minimum price level a Point of Interest can have (1|2|3|4, similar to dollar signs).",
    "filter_price_range_from": "Filter places by a minimum price level, representing the lowest price in the desired range. Accepts an integer value between 0 and 1,000,000.",
    "filter_price_range_to": "Filter places by a maximum price level, representing the highest price in the desired range. Accepts an integer value between 0 and 1,000,000.",
    "filter_properties_business_rating_max": "Filter by the highest desired business rating.",
    "filter_properties_business_rating_min": "Filter by the lowest desired business rating.",
    "filter_publication_year_max": "Filter by the latest desired year of initial publication for the work.",
    "filter_publication_year_min": "Filter by the earliest desired year of initial publication for the work.",
    "filter_rating_max": "Filter by the maximum Qloo rating a Point of Interest must have (float, between 0 and 5).",
    "filter_rating_min": "Filter by the minimum Qloo rating a Point of Interest must have (float, between 0 and 5).",
    "filter_references_brand": "Filter by a comma-separated list of brand entity IDs. Use this to narrow down place recommendations to specific brands. For example, to include only Walmart stores, pass the Walmart brand ID. Each ID must match exactly.",
    "filter_release_country": "Filter by a list of countries where a movie or TV show was originally released.",
    "operator_filter_release_country": "Specifies how multiple filter.release_country values are combined in the query. Use \"union\" (equivalent to a logical \"or\") to return results that match at least one of the specified countries, or \"intersection\" (equivalent to a logical \"and\") to return only results that match all specified countries. The default is \"union\".",
    "filter_release_date_max": "Filter by the latest desired release date.",
    "filter_release_date_min": "Filter by the earliest desired release date.",
    "filter_release_year_max": "Filter by the latest desired release year.",
    "filter_release_year_min": "Filter by the earliest desired release year.",
    "filter_results_entities": "Filter by a comma-separated list of entity IDs. Often used to assess the affinity of an entity towards input.",
    "filter_results_entities_query": "Search for one or more entities by name to use as filters. For GET requests: Provide a single entity name as a string. For POST requests: You can provide a single name or an array of names.",
    "filter_tag_types": "Filter by a comma-separated list of audience types. Each audience type requires an exact match. You can retrieve a complete list of audience types via the v2/audiences/types route.",
    "filter_tags": "Filter by a comma-separated list of tag IDs example (urn:tag:genre:restaurant:Italian). or (urn:tag:genre:brand:fashion) to find popular clothing brands.",
    "operator_filter_tags": "Specifies how multiple filter.tags values are combined in the query. Use \"union\" (equivalent to a logical \"or\") to return results that match at least one of the specified tags, or \"intersection\" (equivalent to a logical \"and\") to return only results that match all specified tags. The default is \"union\".",
    "filter_type": "Filter by the entity type to return (urn:entity:place)."
}

SIGNAL_PARAM_DESCRIPTIONS = {
    "bias_trends": "The level of impact a trending entity has on the results. Supported by select categories only.",
    "signal_demographics_audiences": "A comma-separated list of audiences that influence the affinity score. Audience IDs can be retrieved via the v2/audiences search route.",
    "signal_demographics_audiences_weight": "Specifies the extent to which results should be influenced by the preferences of the chosen audience.",
    "signal_demographics_age": "A comma-separated list of age ranges that influence the affinity score.(35_and_younger|36_to_55|55_and_older).",
    "signal_demographics_gender": "Specifies whether to influence the affinity score based on gender (male|female).",
    "signal_interests_entities": "A list of entity IDs that influence the affinity score. You can also include a weight property to indicate the strength of influence for each entity. For GET requests: Provide a comma-separated list of entity IDs. For POST requests, you can either: -- Send the same string of comma-separated values. -- Send an array of objects with entity and weight properties, such as: [{ \"entity\": \"urn:entity:movie:inception\", \"weight\": 10 }, { \"entity\": \"urn:entity:movie:interstellar\", \"weight\": 25 }] Weights must be greater than 0 and are relative. A weight of 25 means that entity will more heavily influence affinity scores than a weight of 10.",
    "signal_interests_entities_query": "This parameter can only be supplied when using the POST HTTP method, which requires a JSON-encoded body. The value for signal.interests.entities.query is a JSON array containing objects with name and address properties. For a fuzzier search, you can provide an array of strings. When supplied, it overwrites the signal.interests.entities object with resolved entity IDs. The response will contain a path, query.entities.signal, with partial Qloo entities that were matched by the query. If no entities are found, a 400 error will be thrown by the API. Additionally, you can specify how each signal.interests.entities.query item should resolve. The resolve_to property determines whether to resolve to a place, brand, or both. Options are: self: Resolves to a place (default behavior if resolve_to is omitted) urn:reference:brand: Resolves to the brand. both: Resolves to both a place and a brand. Behavior: The system will attempt to resolve to a place. If both or urn:reference:brand is used, it will also pull the brand associated with the resolved place. Resolved entities are returned inside the response.query object: --- If self or no resolve_to option is provided, the resolved place will include an index property pointing to the position of the query in signal.interests.entities.query. --- If urn:reference:brand is provided and the brand is available, it will be returned with the resolved place's information, with entity_id changed to the brand's ID and subtype changed to urn:entity:brand. --- If both is used, both the place and brand will be included, with their index properties pointing to the same value (using the same query). Warnings: If a place does not resolve, it will be included in signal.interests.entities.query warnings as not_found. If a place resolves but a requested brand does not, the brand will be added to the warning could_not_resolve_brand.",
    "signal_interests_tags": "Allows you to supply a list of tags to influence affinity scores. You can also include a weight property that will indicate the strength of influence for each tag in your list. For GET requests: Provide a comma-separated list of tag IDs. For POST requests, you can either: -- Send the same string of comma-separated values. -- Send an array of objects with \"tag\" and \"weight\" properties, such as: [{ \"tag\": \"urn:tag:genre:media:horror\", \"weight\": 7 }, { \"tag\": \"urn:tag:genre:media:thriller\", \"weight\": 20 }] Weights must be greater than 0 and are relative. So, a weight of 20 means that tag will more heavily influence affinity scores than a weight of 7.",
    "operator_signal_interests_tags": "Specifies how multiple signal.interests.tags values are combined in the query. Use \"union\" (equivalent to a logical \"or\") to return results that contain at least one of the specified tags. In this mode, the tag with the highest affinity is used for scoring. - Use \"intersection\" (equivalent to a logical \"and\") or leave this field empty to return results that contain all specified tags, with affinity scores merged across them.",
    "signal_location": "The geolocation to use for geospatial results. The value will be a WKT POINT, POLYGON or a single Qloo ID for a named urn:entity:locality to filter by. WKT is formatted as X then Y, therefore longitude is first (POINT(-73.99823 40.722668)). Unlike filter.location.radius, signal.location.radius is ignored if a Qloo ID or WKT POLYGON is passed.",
    "signal_location_query": "A string query used to search for a named urn:entity:locality Qloo ID for geospatial results, effectively equivalent to passing the same Locality Qloo ID into signal.location. Examples of locality queries include New York City, Garden City, New York, Los Angeles, Lower East Side, and AKAs like The Big Apple. These queries are fuzzy-matched and case-insensitive. When filter.location.query is supplied, the response JSON will include query.locality.signal, which contains the partially matched Qloo entity. If no locality is found, the API will return a 400 error.",
    "signal_location_radius": "The optional radius (in meters), used when providing a WKT POINT. We generally recommend avoiding this parameter, as it overrides dynamic density discovery."
}

OUTPUT_PARAM_DESCRIPTIONS = {
    "diversify_by": "Limits results to a set number of high-affinity entities per city. Set this to properties.geocode.city to enable city-based diversification. Cities are ranked based on the highest-affinity entity within them, and entities within each city are ordered by their individual affinities.",
    "diversify_take": "Sets the maximum number of results to return per city when using diversify.by: \"properties.geocode.city\". For example, if set to 5, the response will include up to 5 entities with the highest affinities in each city.",
    "feature_explainability": "When set to true, the response includes explainability metadata for each recommendation and for the overall result set. Per-recommendation: Each result includes a query.explainability section showing which input entities (e.g. signal.interests.entities) contributed to the recommendation and by how much. Scores are normalized between 0–1. Entities with scores ≥ 0.1 are always included; those below may be omitted to reduce response size. Aggregate impact: The top-level query.explainability object shows average influence of each input entity across top-N result subsets (e.g. top 3, 5, 10, all). Note: If explainability cannot be computed for the request, a warning is included under query.explainability.warning, but results still return normally.",
    "offset": "The number of results to skip, starting from 0. Allows arbitrary offsets but is less commonly used than page.",
    "output_heatmap_boundary": "Indicates the type of heatmap output desired: The default is geohashes. The other options are a city or a neighborhood.",
    "page": "The page number of results to return. This is equivalent to take + offset and is the recommended approach for most use cases.",
    "sort_by": "This parameter modifies the results sorting algorithm (affinity|distance). The distance option can only be used when filter.location is supplied. Do not use this parameter if you want to sort by affinity, as it is the default behavior.",
    "take": "The number of results to return. This should default to 5. If not specified, the API will return 5 results by default. The maximum value is 5, and the minimum is 1."
}
