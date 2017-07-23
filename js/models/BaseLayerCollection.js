define(['backbone','./BaseLayerModel'],function(Backbone,BaseLayerModel){
    var BaseLayerCollection = Backbone.Collection.extend({
        model : BaseLayerModel,
        initialize : function(){
        },
        fetch : function(){
            var models = [
				new BaseLayerModel({
				    //url : 'images/baseImage.png',
                    url : 'images/BlueMarble_4L/',
				    name : 'Image',
				    thumbnail : 'images/bluemarble.png',
				    title : 'Image',
				    type : 'IMAGE'
				}),
                new BaseLayerModel({
                    url : '//dev.virtualearth.net',
                    name : 'BingMap',
                    thumbnail : 'images/Bing.png',
                    title : 'BingMap',
                    type : 'BINGMAP'
                }),
                new BaseLayerModel({
                    url : 'http://t0.tianditu.com/img_w/wmts',
                    name : '天地图',
                    thumbnail : 'images/tianditu.png',
                    title : '天地图',
                    type : 'TIANDITU'
                }),
                new BaseLayerModel({
                    url : 'https://a.tile.openstreetmap.org/',
                    name : 'Open Street Map',
                    thumbnail : 'images/OSM.png',
                    title : 'Open Street Map',
                    type : 'OSM'
                })
            ];
            this.reset(models);
        }
    });
    return BaseLayerCollection;
});