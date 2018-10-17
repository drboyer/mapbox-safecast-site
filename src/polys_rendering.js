"use strict";
const polyline = require('@mapbox/polyline');

// TODO: Support languages other than en?
function renderFeatures(inputPolyFeatures) {
    const outputFeatures = inputPolyFeatures.polys.map((inpoly) => {
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
            return {
                type: 'Feature',
                properties,
                geometry: {
                    type: 'Point',
                    coordinates: [inpoly.point.x, inpoly.point.y]
                }
            };
        } else if (inpoly.path) {
            return {
                type: 'Feature',
                properties,
                geometry: polyline.toGeoJSON(inpoly.path)
            };
        }
    });
    return {
        type: 'FeatureCollection',
        features: outputFeatures
    };
}

// TODO: render some Mapbox popups?

module.exports = renderFeatures;