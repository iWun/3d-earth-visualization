define([
        'backbone',
        'Cesium',
        'jquery'],
        function(Backbone,Cesium,$){
	var _ = require('underscore');
    var SceneModel = Backbone.Model.extend({
        initialize : function(viewer){
            this.viewer = viewer;
            this.stkTerrainProvider = new Cesium.CesiumTerrainProvider({
                url: '//assets.agi.com/stk-terrain/world',
                requestWaterMask : true,
                requestVertexNormals : true
            });
            this.ellipsoidTerrainProvider = new Cesium.EllipsoidTerrainProvider({
                ellipsoid : viewer.scene.globe.ellipsoid
            });
            //this.layers = new LayerCollection();
        },
        addLayer : function(layerModel,isFlyMode){
            if(!layerModel){
                return;
            }
            var me = this;
            layerModel.addLayer(this,isFlyMode);
        },
        addLayers : function(layers,isFlyMode){
        	if(!layers){
        		return;
        	}
        	var me = this;
        	isFlyMode = isFlyMode == false ? false : true;
        	layers.each(function(layerModel, idx) {
                me.addLayer(layerModel,isFlyMode);
            });
        },
        removeLayer : function(layerModel){
        	if(!layerModel){
                return;
            }
        	if(layerModel.get('type') == 'TERRAIN'){
        		this.setTerrain($("#chkTerrain").is(':checked'));
        	}
        	layerModel.removeLayer(this.viewer);
            
        },
        addMarker : function(markerModel){
        	if(this.defaultKmlLayer){
        		this.defaultKmlLayer.addMarker(markerModel,this,this.currentMarker);
        		this.trigger('markerAdded',markerModel);
        	}
        	
        },
        removeMarker : function(markerModel){
        	if(!markerModel){
        		return;
        	}
        	var entity = markerModel.layer;
        	if(this.viewer.entities.contains(entity)){
        		this.viewer.entities.remove(entity);
        	}
        	else{
        		var ds = this.viewer.dataSources.get(0);
        		if(ds && ds.entities.contains(entity)){
        			ds.entities.remove(entity);
        		}
        	}
        },
        removeCurrentMarker : function(){
        	var marker = this.currentMarker;
        	if(marker){
        		this.viewer.entities.remove(marker);
        		this.currentMarker = undefined;
        	}
        },
        setTerrain : function(isStkTerrain){
        	if(isStkTerrain){
        		this.viewer.terrainProvider = this.stkTerrainProvider;
        	}
        	else{
        		this.viewer.terrainProvider = this.ellipsoidTerrainProvider;
        	}
        },
        setBaseLayer : function(baseLayerModel){
        	if(!baseLayerModel){
        		return ;
        	}
        	baseLayerModel.setBaseLayer(Cesium,this.viewer);
        },
        addTileset : function(TileLayerModel){
            if(!TileLayerModel){
                return ;
            }
            TileLayerModel.addTileset(Cesium,this.viewer);
        },
        visualize : function(VisualLayerModel){
            if(!VisualLayerModel){
                return ;
            }
            VisualLayerModel.visualize(Cesium,this.viewer);
        },
        
        setCamera : function(cameraJson){
        	if(!cameraJson){
        		return ;
        	}
        	
        	var camera = this.viewer.scene.camera;
        	var ps = cameraJson.position;
        	camera.setView({
                destination : new Cesium.Cartesian3(ps.x,ps.y,ps.z),
                orientation : {
                    heading : cameraJson.heading,
                    pitch : cameraJson.pitch,
                    roll : cameraJson.roll
                }
            });
        }
    });
    return SceneModel;
});