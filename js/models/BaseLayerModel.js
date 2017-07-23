define(['backbone','Cesium','../Util'],function(Backbone,Cesium,Util){
    var BaseLayerModel = Backbone.Model.extend({
        defaults : {
            title : '',
            url : '',
            thumbnail : '',
            name : '',
            type : ''
        },
        initialize : function(){
        	var type = this.get('type');
        	var url = this.get('url');
        	switch(type){
	        	case 'BINGMAP' : this.imageryProvider = new Cesium.BingMapsImageryProvider({
                    url : url,
                    key : 'Aslxp36RlCzdTILdo26xlRBwaIgLhvN38SIICG-1Th7_vxenhiQWD_eIfjBn_jh3',
                    mapStyle : Cesium.BingMapsStyle.AERIAL
                });break;
	        	case 'TIANDITU' : this.imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
	                url : url,
	                layer : 'img',
	                style : 'default',
	                format : 'tiles',
	                tileMatrixSetID : 'w',
	                credit : new Cesium.Credit('天地图全球影像服务'),
	                subdomains : ['t0','t1','t2','t3','t4','t5','t6','t7'],
	                maximumLevel : 18
	            });break;
	        	//case 'IMAGE' : this.imageryProvider = new Cesium.SingleTileImageryProvider({url : url});break;
				case 'IMAGE' : this.imageryProvider = Cesium.createTileMapServiceImageryProvider({
					url : url,
					fileExtension: 'png'
				});break;
				case 'OSM' : this.imageryProvider = new Cesium.createOpenStreetMapImageryProvider({url : url});break;
	        	default : break;
        	}
        },
        setBaseLayer : function(Cesium,viewer){
        	if(!Cesium || !viewer){
        		return ;
        	}
    		var url = this.get('url');
    		var imageryLayerCollection = viewer.scene.globe._imageryLayerCollection;
            var layer = imageryLayerCollection.get(0);
            imageryLayerCollection.remove(layer, true);
            imageryLayerCollection.addImageryProvider(this.imageryProvider, 0);
        }
    });
    return BaseLayerModel;
});