require(['common'],function(){
	require(["Cesium"], function(Cesium){
		function isPCBroswer() {
	        var sUserAgent = window.navigator.userAgent.toLowerCase();
	        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	        var bIsAndroid = sUserAgent.match(/android/i) == "android";
	        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
	            return false;
	        } else {
	            return true;
	        }
	    }
		var options = {
				geocoder : true
		};
		var isPCBroswer = isPCBroswer();
		
		window.isPCBroswer = isPCBroswer;
		
		var viewer;
		if(isPCBroswer){
			viewer = new Cesium.Viewer('cesiumContainer',{
				animation : false,//是否创建动画小器件，左下角仪表
				baseLayerPicker : false,//是否显示图层选择器
				geocoder : true,
				homeButton : false,//是否显示Home按钮
				//infoBox : false,//是否显示信息框
				sceneModePicker : false,//是否显示3D/2D选择器
				selectionIndicator : false,//是否显示选取指示器组件
				timeline : false,//是否显示时间轴
				navigationHelpButton : false,//是否显示右上角的帮助按钮
				imageryProvider : new Cesium.BingMapsImageryProvider({
					url : '//dev.virtualearth.net',
					key : "AjQhMyw76oicHqFz7cUc3qTEy3M2fC2YIbcHjqgyMPuQprNVBr3SsvVdOfmlVc0v"
				})
				// imageryProvider : Cesium.createTileMapServiceImageryProvider({
				// 	url : 'images/BlueMarble_4L/',
				// 	fileExtension: 'png'
				// })
				// imageryProvider : Cesium.createTileMapServiceImageryProvider({
				// 	url : 'images/NaturalEarthII/',
				// 	fileExtension: 'jpg'
				// })
				// terrainProvider : new Cesium.CesiumTerrainProvider({
				// 	url : 'https://assets.agi.com/stk-terrain/world'
				// })
				
			});
			viewer.bottomContainer.innerHTML=""//去掉cesium标志

		}
		else{
			viewer = new Cesium.Viewer('cesiumContainer',{
				animation : false,//是否创建动画小器件，左下角仪表
				baseLayerPicker : false,//是否显示图层选择器
				geocoder : true,
				fullscreenButton : true,
				homeButton : false,//是否显示Home按钮
				//infoBox : false,//是否显示信息框
				sceneModePicker : false,//是否显示3D/2D选择器
				selectionIndicator : false,//是否显示选取指示器组件
				timeline : false,//是否显示时间轴
				navigationHelpButton : false,//是否显示右上角的帮助按钮
				imageryProvider : Cesium.createTileMapServiceImageryProvider({
					url : 'images/BlueMarble_4L/',
					fileExtension: 'png'
				})
			});
			viewer.bottomContainer.innerHTML=""//去掉cesium标志

			var scene = viewer.scene;
			if(Cesium.defined(scene.sun)) {
				scene.sun.show = false;
			}
			if(Cesium.defined(scene.moon)) {
				scene.moon.show = false;
			}
//			if(Cesium.defined(scene.skyAtmosphere)) {
//				scene.skyAtmosphere.show = false;
//			}
			if(Cesium.defined(scene.skyBox)) {
				scene.skyBox.show = false;
			}
		}
		/*viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
            //url: '//assets.agi.com/stk-terrain/world',
			url : Cesium.buildModuleUrl('Terrain_STK'),
            requestWaterMask : true,
            requestVertexNormals : true,
            credit : ''
        });*/
		viewer.scene.globe.depthTestAgainstTerrain = true;
		var radii = viewer.scene.globe.ellipsoid.radii;
		var OUTER_RADIUS = Cesium.Cartesian3.maximumComponent(Cesium.Cartesian3.multiplyByScalar(radii, 1.025, new Cesium.Cartesian3()));
		/*viewer.clock.onTick.addEventListener(function(){
			var cameraPos = viewer.scene.camera.positionWC;
			var fCameraHeight2 = Cesium.Cartesian3.magnitudeSquared(cameraPos);
			var fCameraHeight = Math.sqrt(fCameraHeight2);
			if(fCameraHeight > OUTER_RADIUS){
				viewer.scene.globe.depthTestAgainstTerrain = true;
			}
			else{
				viewer.scene.globe.depthTestAgainstTerrain = false;
			}
		});*/
		viewer.scene.globe.enableLighting = true;
		require(['jquery'],function($){
			$("#loadOverlay").hide();
			$('#loadbar').removeClass('ins');
			Window.LOADING_FLAG = false;

	        require(['flatui','./views/ToolBar','./tools/Position','./views/ViewerContainer','./models/SceneModel','./views/ErrorPannel','./views/Compass','./views/GeoLocation'],
	        		function(flatui,ToolBar,Position,ViewerContainer,SceneModel,ErrorPannel,Compass,GeoLocation){
	        	var sceneModel = new SceneModel(viewer);
	            var viewerContainer = new ViewerContainer();
	            var toolBar = new ToolBar({
	                sceneModel : sceneModel,
	                isPCBroswer : isPCBroswer
	            });
	            viewerContainer.addComponent(toolBar, new Position());
	            if(!isPCBroswer){
	            	$('#addMarkerBtn').hide();
	            	$('#measureBtn').hide();
	            }
	            var errorPannel = new ErrorPannel();
	            viewerContainer.addComponent(errorPannel);
	            var compassContainer = new Compass({
	            	sceneModel : sceneModel
	            });
	            viewerContainer.addComponent(compassContainer,new Position({
	            	mode : 'rt',
	            	x : '20px',
	            	y : '100px'
	            }));
	            var locationContainer = new GeoLocation({
					sceneModel : sceneModel
				});
				viewerContainer.addComponent(locationContainer,new Position({
					mode : 'rt',
					x : '20px',
					y : '150px'
				}));

		        // $('#save').on('click',function(evt){
					// if(sceneModel){
					// 	sceneModel.save();
					// }
					// evt.stopPropagation();
					// return false;
		        // });
		        // if(window.isLogin){
		        // 	if(sceneModel){
					// 	sceneModel.open();
					// }
		        // }
		        // else if(isPCBroswer){
		        // 	$("body").append("<iframe id='innerIframe' style='top:10000px;left:0;border:none;display:none;' src='http://www.supermapol.com/services/security/logout'></iframe>");
		        // }
	        });
		});
	});
});