const map = L.map('map', {
    zoomControl: true,
    zoomSnap: 0.5,
    minZoom: 5,
    maxZoom: 15
}).setView([-0.170, -0.906], 6);;

const bounds = [[90,-180], [-90,180]];
map.setMaxBounds(bounds);

//from mesh_style.js
mesh_all_stats.addTo(map);

const info = L.control({position: 'bottomleft'});
info.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function(props){
    if (L.Browser.mobile){
        this._div.innerHTML = '<p class=tipstyle01>キーワード: ' + (props ? props.keywords.substring(1, 30) + ' (' + props.size + '件)</p>': '六角形グリッドをタップで表示');
    } else {
        this._div.innerHTML = '<p class=tipstyle01>キーワード: ' + (props ? props.keywords.substring(1, props.keywords.length-1) + '　（' + props.size + '件）</p>': '六角形グリッドにカーソルを合わせると表示されます');
    }
};
info.addTo(map);

let miniMap;
if (L.Browser.mobile){
    miniMap = new L.Control.MiniMap(mesh_simple, {zoomLevelFixed:5, position:'bottomleft', centerFixed:[-0.170, -0.906], width:210, height:250, toggleDisplay:true, minimized:true});
} else {
    miniMap = new L.Control.MiniMap(mesh_simple, {zoomLevelFixed:5, position:'bottomleft', centerFixed:[-0.170, -0.906], width:210, height:250, toggleDisplay:true, minimized:false});
}
miniMap.addTo(map);

map.createPane("pane620").style.zIndex = 620;

const point_marker = {
    pane: "pane620",
    radius: 10,
    fillColor: "#90ee90",
    color: "#ffffff",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
};

const label_marker = {
    radius: 0,
    fillColor: "transparent",
    color: "transparent",
    weight: 0,
    opacity: 0,
    fillOpacity: 1.0
};

const TooltipClass = {
    'className': 'class-tooltip'
}
  
function onEachFeature_label(feature, layer){
    const label = feature.properties.label;
    const tooltipContent = '<p class="tipstyle02">'+label+'</p>';
    layer.bindTooltip(tooltipContent, {permanent: true, direction: 'center', opacity:0.9, ...TooltipClass});
}

function onEachFeature_doc(feature, layer){
    const popupContent = '<a href="https://kaken.nii.ac.jp/ja/search/?qb=' + feature.properties.doc_id + '" target="_blank">リンク</a>';
    const popupStyle = L.popup({autoPan:false, offset:[0,5]}).setContent(popupContent);
    layer.bindPopup(popupStyle);
}

const doc_point = new L.geoJson(point_data, {
    onEachFeature: onEachFeature_doc,
    pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng, point_marker);
    }
});

const label_layer = new L.geoJson([], {
    onEachFeature: onEachFeature_label,
    pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng, label_marker);
    }
});

const doc_cluster = new L.MarkerClusterGroup({
                        showCoverageOnHover: false,
                        maxClusterRadius: 100,
                        spiderfyDistanceMultiplier: 3,
                        disableClusteringAtZoom: 12,
                        zoomToBoundsOnClick: true,
                        chunkedLoading: true,
                        //chunkProgress: updateProgressBar
                    });

//const mesh_filtered = new L.geoJson([], {style: style_mesh_all, onEachFeature: stats_mesh_all_onEachFeature, filter: filter_mesh});

map.on('zoomend', function() {
    if (map.getZoom() < 8){
        label_layer.clearLayers();
        label_layer.addData(label_data_1)
        label_layer.addTo(map)
    }else{
        label_layer.clearLayers();
        label_layer.addData(label_data_2)
        label_layer.addTo(map)
    }
    });

doc_cluster.addLayer(doc_point);
label_layer.addTo(map);
map.zoomIn(0.5);

//search box
const searchLayer = new L.layerGroup([
    mesh_all_stats,
    //doc_point
     ]);
searchLayer.addTo(map);

const searchControl = new L.control.search({
                 position:'topright',
                 layer: searchLayer,
                 autoResize: false,
                 textErr: 'Not found',
                 initial: false,
                 propertyName: 'keywords',
                 marker: new L.Icon({iconSize: [10,10], animate:false, circle:false}),
                 //hideMarkerOnCollapse: true,
                 zoom: false,
                 minLength: 1,
                 collapsed: false,
                 textPlaceholder: '六角形グリッドのキーワード検索　                 '
                 });
searchControl.on('search:locationfound', function(e){
    alert("found")
});

if (!L.Browser.mobile) {
    map.addControl( searchControl );
}

//legend
const overlayMaps = {
    '<i class="far fa-circle fa-fw" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:grey"></i> 各研究へのリンク': doc_cluster,
    '<i class="fas fa-font fa-fw" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:grey"></i> ラベル': label_layer
};

const baseMaps = {  
    //'<i class="fas fa-coins fa-fw" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:grey"></i> フィルター': mesh_filtered,
    '<i class="fas fa-coins fa-fw" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:grey"></i> 研究額の密集度(2017年〜2020年)': mesh_201720wt_stats,
    '<i class="fas fa-coins fa-fw" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:grey"></i> 研究額の密集度': mesh_allwt_stats,
    '<i class="far fa-file-alt fa-fw" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:grey"></i> 研究数の密集度(2017年〜2020年)': mesh_201720_stats,
    '<i class="far fa-file-alt fa-fw" style="color:#555"></i><i class="fa fa-caret-right fa-fw" style="color:grey"></i> 研究数の密集度<br><img src="app/css/images/legend.png" width="200">': mesh_all_stats,
};

//Control: Slide Menu
const slidemenutitle = '<h2 align="center">Academic Atlas</h2><hr color="white">';
let contents = '<p align="center">日本国内の主要大学における<br>学術研究分野の概念マップ<br>（注）現在作成中：サンプルとして東京大学のみ</p>'
contents += '<p align="center">情報元：<a href="https://kaken.nii.ac.jp/" target="_blank">KAKEN：科学研究費助成事業データベース（国立情報学研究所）</a></p><hr color="white">';
contents += '<p align="center">このウェブページの解析・可視化データは、上記の情報元サービスのデータを参照し、当サイト管理者が独自に加工したものとなります。<br>もしご意見等があれば下記へ連絡ください。</p><p align="center"><i class="fas fa-envelope fa-fw"></i>: e.horishita"at"gmail.com</p><hr color="white">';
contents += '<h2 align="center">概要</h2>'
contents += '<ul><p align="left"><li>国立情報学研究所が公開しているオープンデータ「KAKEN：科学研究費助成事業データベース」の情報(2020年7月末時点)に基づき、各大学の研究分野の全体像を仮想マップ上に表現するプロジェクトです。</li>' +
'<li>文書ベクトル化は研究タイトル及び研究概要のテキスト情報を対象にしており、そこから得られたキーワードをマップ上の六角形メッシュ単位で集計し、概要が把握できるように構成しています。</li>' +
'<li>同様に、マップ上のラベルは全体の中で研究数の密集度合いの高い箇所について代表的なキーワードをピックアップし、大まかな位置と事業内容が把握できるようにしたものです。</li>' +
'<li>「研究の密集度」は、各メッシュの中心から各事業までの距離の逆数を乗算した値を元に、独自計算した密度評価値で色付けしています。また、「研究額の密集度」については、それに各研究への科学研究費による助成金額を加味したものです。概要把握のための参考情報としてください。</li>' +
'<li>マップ上の各点をクリック/タップすることで、個別の研究内容のリンクを参照できます。</li></p></ul>';

//Control
if (L.Browser.mobile) {
    L.control.layers(baseMaps, overlayMaps,{collapsed:true}).addTo(map)}
else{
    L.control.layers(baseMaps, overlayMaps,{collapsed:false}).addTo(map);
}

L.Control.zoomHome({homeCoordinates: [-0.170, -0.906], homeZoom: 6}).addTo(map);
L.control.slideMenu(slidemenutitle + contents, {width: '280px'}).addTo(map);
L.easyButton('<i class="fa fa-adjust fa-fw" style="color:black"></i><i class="fa fa-caret-right fa-fw" style="color:grey"></i>', function(){ location.href = "https://co-place.com/"; }).addTo(map);
