//density layer
let mesh_simple;
let mesh_all_stats;
let mesh_allwt_stats;
let mesh_201720_stats;
let mesh_201720wt_stats;

function getColor_stats(d){
    return d > 17 ? '#d7191c':
    d > 15 ? '#e2402e':
    d > 13 ? '#ec6841':
    d > 12 ? '#f69053':
    d > 11 ? '#feb467':
    d > 10 ? '#fec980':
    d > 9 ? '#ffdf9a':
    d > 8 ? '#fff5b3':
    d > 7 ? '#f4fbbc':
    d > 6 ? '#def2b4':
    d > 5 ? '#c7e9ad':
    d > 4 ? '#b1e0a6':
    d > 3 ? '#91cba9':
    d > 2 ? '#80bfac':
    d > 1 ? '#6fb3ae':
    d > 0 ? '#4d9bb4':
    '#2b83ba';
}

function style_simple(feature){
    return{
        fillcolor: 'white',
        weight: 1,
        opacity: 1,
        color: '#64abb0',
        dashArray: '',
        fillOpacity: 0.6
    };
}

function style_mesh_all(feature){
    return{
    fillColor: getColor_stats(feature.properties.density_all),
    weight: 0.7,
    opacity: 1,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.8
    };
}

function style_mesh_allwt(feature){
    return{
    fillColor: getColor_stats(feature.properties.density_all_wt),
    weight: 0.7,
    opacity: 1,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.8
    };
}

function style_mesh_201720(feature){
    return{
    fillColor: getColor_stats(feature.properties.density_201720),
    weight: 0.7,
    opacity: 1,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.8
    };
}

function style_mesh_201720wt(feature){
    return{
    fillColor: getColor_stats(feature.properties.density_201720_wt),
    weight: 0.7,
    opacity: 1,
    color: 'white',
    dashArray: '',
    fillOpacity: 0.8
    };
}

function highlightFeature_mesh_common(e){
    const stats_layer = e.target;
    stats_layer.setStyle({
                         weight: 2,
                         color: 'white',
                         dashArray: '',
                         fillOpacity: 0.7
                         });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge){
        stats_layer.bringToFront();
    }
    info.update(stats_layer.feature.properties);
}

function resetHighlight_mesh_all(e){
    mesh_all_stats.resetStyle(e.target);
    info.update();
}

function resetHighlight_mesh_allwt(e){
    mesh_allwt_stats.resetStyle(e.target);
    info.update();
}

function resetHighlight_mesh_201720(e){
    mesh_201720_stats.resetStyle(e.target);
    info.update();
}

function resetHighlight_mesh_201720wt(e){
    mesh_201720wt_stats.resetStyle(e.target);
    info.update();
}

function infoFeature_mesh_common(e){
    const stats_layer = e.target;
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge){
        stats_layer.bringToFront();
    }
}

function zoomToFeature(e) {
    //map.fitBounds(e.target.getBounds());
    map.panTo(e.target.getCenter());
}

function stats_mesh_all_onEachFeature(feature, layer){
    if (L.Browser.mobile){
        layer.on({
                 click: highlightFeature_mesh_common
                 });
    }else{
        layer.on({
                 mouseover: highlightFeature_mesh_common,
                 mouseout: resetHighlight_mesh_all,
                 click: zoomToFeature
                 });
    };
}

function stats_mesh_allwt_onEachFeature(feature, layer){
    if (L.Browser.mobile){
        layer.on({
                 click: highlightFeature_mesh_common
                 });
    }else{
        layer.on({
                 mouseover: highlightFeature_mesh_common,
                 mouseout: resetHighlight_mesh_allwt,
                 click: zoomToFeature
                 });
    };
}

function stats_mesh_201720_onEachFeature(feature, layer){
    if (L.Browser.mobile){
        layer.on({
                 click: highlightFeature_mesh_common
                 });
    }else{
        layer.on({
                 mouseover: highlightFeature_mesh_common,
                 mouseout: resetHighlight_mesh_201720,
                 click: zoomToFeature
                 });
    };
}

function stats_mesh_201720wt_onEachFeature(feature, layer){
    if (L.Browser.mobile){
        layer.on({
                 click: highlightFeature_mesh_common
                 });
    }else{
        layer.on({
                 mouseover: highlightFeature_mesh_common,
                 mouseout: resetHighlight_mesh_201720wt,
                 click: zoomToFeature
                 });
    };
}

mesh_simple = new L.geoJson(mesh_data, {style: style_simple});
mesh_all_stats = new L.geoJson(mesh_data, {style: style_mesh_all, onEachFeature: stats_mesh_all_onEachFeature});
mesh_allwt_stats = new L.geoJson(mesh_data, {style: style_mesh_allwt, onEachFeature: stats_mesh_allwt_onEachFeature});
mesh_201720_stats = new L.geoJson(mesh_data, {style: style_mesh_201720, onEachFeature: stats_mesh_201720_onEachFeature});
mesh_201720wt_stats = new L.geoJson(mesh_data, {style: style_mesh_201720wt, onEachFeature: stats_mesh_201720wt_onEachFeature});
