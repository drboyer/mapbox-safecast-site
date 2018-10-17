"use strict";
const polyline = require('@mapbox/polyline');

// TODO: Support languages other than en?
function renderFeatureLayers(inputPolyFeatures) {
    const outputLayers = {
        pointFeatures: {
            type: 'FeatureCollection',
            features: []
        },
        pathFeatures: {
            type: 'FeatureCollection',
            features: []
        }
    };
    
    inputPolyFeatures.polys.forEach((inpoly) => {
        const properties = {
            poly_id: inpoly.poly_id,
            group_id: inpoly.group_id,
            author: inpoly.author,
            date: inpoly.date,
            title: inpoly.desc,
            info: inpoly.info,
            imgs: inpoly.imgs,
            more: inpoly.more,  // links?
            attribution: inpoly.atts  // attributions
        };
        if (inpoly.point) {
            outputLayers.pointFeatures.features.push({
                type: 'Feature',
                properties,
                geometry: {
                    type: 'Point',
                    coordinates: [inpoly.point.x, inpoly.point.y]
                }
            });
        } else if (inpoly.path) {
            outputLayers.pathFeatures.features.push({
                type: 'Feature',
                properties,
                geometry: polyline.toGeoJSON(inpoly.path)  // TODO: convert ot Polygon?
            });
        }
    });
    return outputLayers;
}

// TODO: render some Mapbox popups?

module.exports = renderFeatureLayers;