define(['backbone','Cesium','../Util'],function(Backbone,Cesium,Util){
    var TileLayerModel = Backbone.Model.extend({
        defaults : {
            title : '',
            url : '',
            thumbnail : '',
            name : '',
            type : ''
        },
        initialize : function(){
        	this.type = this.get('type');
        	this.url = this.get('url');

        },
		addTileset : function(Cesium,viewer){
			if(!Cesium || !viewer){
				return ;
			}
            // if (viewer.scene.primitives.length > 0) {
            //     viewer.scene.primitives.removeAll();
            // }
            if (viewer.dataSources.length > 0) {
                viewer.dataSources.removeAll();
            }

            var layers = viewer.imageryLayers,
                length = layers.length;
            for (var i = 1; i < length; i++) {
                if (layers.get(i))
                    layers.remove(layers.get(i), true);
            }

            if (this.type === "luxi") {
                viewer.scene.imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
                    url : 'datas/dom/luxi',
                    fileExtension: 'png',
                }));
                viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
                    url: "datas/dom/terrain"
                })
			}

			loadTileset(this.url);

			function loadTileset(url) {
				//reset();

				tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
					url : url,
					debugShowStatistics : true,
					maximumNumberOfLoadedTiles : 0,
					//refineToVisible : true
					//debugShowBoundingVolume:true,
					//debugShowContentBoundingVolume:true,
					debugShowPickStatistics:true,
					debugShowViewerRequestVolume:true,
					dynamicScreenSpaceError:true

				}));

				return tileset.readyPromise.then(function(tileset) {
					var boundingSphere = tileset.boundingSphere;
					viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
					viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

					var properties = tileset.properties;


					tileset.loadProgress.addEventListener(function(numberOfPendingRequests, numberProcessing) {
						if ((numberOfPendingRequests === 0) && (numberProcessing === 0)) {
							//console.log('Stopped loading');
							return;
						}
					});

					tileset.tileUnload.addEventListener(function(tile) {
					});
				});
			}
		}

    });
    return TileLayerModel;
});