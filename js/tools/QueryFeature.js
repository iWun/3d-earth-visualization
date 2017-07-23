define(['Cesium','../Util','./Query'],function(Cesium,Util,Query){
    'use strict';

    /**
     * 创建描述信息
     * @param Cesium
     * @param properties
     * @returns {string}
     */
    function createDescription(Cesium,properties){
        var simpleStyleIdentifiers = ['SMID','SMUSERID','ID','类型ID','tName','modelName'];
        var html = '';
        for ( var key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (simpleStyleIdentifiers.indexOf(key) !== -1) {
                    continue;
                }
                var value = properties[key];
                if (Cesium.defined(value) && value !== '') {
                    html += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
                }
            }
        }
        if (html.length > 0) {
            html = '<table class="zebra"><tbody>' + html + '</tbody></table>';
        }
        return html;
    }

    var FeatureCache = {};
    var QueryFeature = function(options){
        var viewer = options.viewer;
        if(!viewer){
            return ;
        }
        var scene = viewer.scene;
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(e){
            var layers = scene.layers;
            for(var i = 0,j = layers._layerQueue.length;i < j;i++){
                var layer = layers.findByIndex(i);
                if(Cesium.defined(layer)){
                    var id = scene.getSelectID(e.position, layer);
                    if(Cesium.defined(id) && 16777215 !== id){
                        if(Cesium.defined(FeatureCache[id])){
                            var data = FeatureCache[id];
                            var description = createDescription(Cesium,data);
                            var entity = new Cesium.Entity({
                                description : description,
                                name : data.modelName || ''
                            });
                            viewer.selectedEntity = entity;
                        }
                        else{
                            var layerName = layer._name;
                            if(Util.SCPURL_SET[layerName]){
                                var url = Util.SCPURL_SET[layerName].dataUrl;
                                var dataSourceName = Util.SCPURL_SET[layerName].datasource;
                                var dataSetName = Util.SCPURL_SET[layerName].dataset;
                                var filter = 'SmID=' + id;
                                var promise = Query.query(Cesium,{
                                    url : url,
                                    dataSourceName : dataSourceName,
                                    dataSetName : dataSetName,
                                    filter : filter
                                });
                                Cesium.when(promise,function(features){
                                    var data = features[0].data;
                                    var entity = new Cesium.Entity({
                                        description : createDescription(Cesium,data)
                                    });
                                    viewer.selectedEntity = entity;
                                    FeatureCache[id] = data;
                                });
                            }

                        }
                        break;
                    }
                }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    return QueryFeature;
});