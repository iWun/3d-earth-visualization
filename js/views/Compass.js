define(['./Container', 'Cesium'],function(Container, Cesium){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        '<a id="btnCompass" class="compassBtn">',
        '<img id="compass" src="images/compass.png" class="compassPic">',
        '</a>'
    ].join('');
    var Compass = Container.extend({
        template : _.template(htmlStr),
        initialize : function(options){
            this.viewer = options.sceneModel.viewer || null;
            var scene = this.viewer.scene;
            scene.postRender.addEventListener(function(){
              var heading = scene.camera.heading;
              var x = Cesium.Math.toDegrees(heading);
              var degrees = "rotate(" + x + "deg)";
              $("#compass").css("transform", degrees);
            })
            this.render();
        },
        render : function(){
            this.$el.html(this.template());
            return this;
        },
        events : {
            'click #btnCompass' : 'reduceCompass'
        },
        reduceCompass : function(){
            var scene = this.viewer.scene;
            $("#compass").css("transform", "rotate(0deg)");

            scene.camera.flyTo({
              destination : scene.camera.position,
              orientation : {
                  heading : Cesium.Math.toRadians(0)
              }
            });
        }
    });
    return Compass;
});
