define(['backbone', 'Cesium', '../Util'], function (Backbone, Cesium, Util) {
    var ClimateLayerModel = Backbone.Model.extend({
        defaults: {
            title: '',
            url: '',
            thumbnail: '',
            name: '',
            type: ''
        },
        initialize: function () {

            // switch(type){
            // 	case 'BINGMAP' : this.imageryProvider = new Cesium.BingMapsImageryProvider({
            // 		url : url,
            // 		key : "AjQhMyw76oicHqFz7cUc3qTEy3M2fC2YIbcHjqgyMPuQprNVBr3SsvVdOfmlVc0v"
            // 		});break;
            // 	case 'TIANDITU' : this.imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
            //         url : url,
            //         layer : 'img',
            //         style : 'default',
            //         format : 'tiles',
            //         tileMatrixSetID : 'w',
            //         credit : new Cesium.Credit('天地图全球影像服务'),
            //         subdomains : ['t0','t1','t2','t3','t4','t5','t6','t7'],
            //         maximumLevel : 18
            //     });break;
            // 	//case 'IMAGE' : this.imageryProvider = new Cesium.SingleTileImageryProvider({url : url});break;
            // case 'IMAGE' : this.imageryProvider = Cesium.createTileMapServiceImageryProvider({
            // 	url : url,
            // 	fileExtension: 'jpg'
            // });break;
            // case 'OSM' : this.imageryProvider = new Cesium.createOpenStreetMapImageryProvider({url : url});break;
            // 	default : break;
            // }
        },
        visualize: function (Cesium, viewer) {
            if (!Cesium || !viewer) {
                return;
            }
            if (viewer.dataSources.length > 0) {
                viewer.dataSources.removeAll();
            }
            var type = this.get('type');
            var url = this.get('url');

            var layers = viewer.imageryLayers,
                length = layers.length,
                satelliteLayerUrlCacheIntervalInSeconds = 300,
                a = satelliteLayerUrlCacheIntervalInSeconds ? "&" + Math.floor((new Date).getTime() / 1E3 / satelliteLayerUrlCacheIntervalInSeconds) : "";

            for (var i = 1; i < length; i++) {
                if (layers.get(i))
                    layers.remove(layers.get(i), true);
            }

            layers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                url: url + a,
                credit: "UW-Madison SSEC"
            }));
            console.log(layers.length);


        }

    });
    return ClimateLayerModel;
});