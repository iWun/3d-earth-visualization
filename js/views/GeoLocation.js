define(['./Container', 'Cesium'],function(Container, Cesium){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        '<a id="btnLocation" class="compassBtn">',
        '<img id="location" src="images/geolocation.png" class="compassPic">',
        '</a>'
    ].join('');
    var GeoLocation = Container.extend({
        template : _.template(htmlStr),
        initialize : function(options) {
            this.viewer = options.sceneModel.viewer || null;
            var ua = window.navigator.userAgent.toLowerCase();
            var me = this;
            if(ua.match(/MicroMessenger/i) == "micromessenger"){
            	me.isWechatBrowser = true;
            }else{
            	me.isWechatBrowser = false;
            }
            this.render();
        },
        render : function() {
            this.$el.html(this.template());
            return this;
        },
        events : {
            'click #btnLocation' : 'showLocation'
        },
        showLocation : function() {
        	var viewer = this.viewer;
        	var me = this;
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                	var entity = new Cesium.Entity();
                	entity.name = '您当前所在位置';
                	entity.description = {
                		getValue : function() {
                			return '经度:' + position.coords.longitude.toFixed(2) +'\n' + '纬度:' + position.coords.latitude.toFixed(2);
                		}
                	}
                	
                	
                	if(me.isWechatBrowser){
                		alert("经度:" + position.coords.longitude.toFixed(2) + " 纬度:" + position.coords.latitude.toFixed(2));
                	}else{
                		viewer.selectedEntity = entity;
                	}
                	
                	viewer.scene.camera.flyTo({
                		destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 500)
                	});
                });
            }else {
            	var entity = new Cesium.Entity();
            	entity.name = '错误';
            	entity.description = {
            		getValue : function() {
            			return '您的浏览器不支持此项功能';
            		}
            	}
            	viewer.selectedEntity = entity;
            }
        }, 	
    });
    return GeoLocation;
});
