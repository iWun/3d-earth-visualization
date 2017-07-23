define(['backbone', 'Cesium', '../Util'], function (Backbone, Cesium, Util) {
    var VisualLayerModel = Backbone.Model.extend({
        defaults: {
            title: '',
            url: '',
            thumbnail: '',
            name: '',
            type: ''
        },
        initialize: function () {
            var type = this.get('type');
            var url = this.get('url');

        },
        visualize: function (Cesium, viewer) {
            if (!Cesium || !viewer) {
                return;
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

            var type = this.get('type');
            switch (type) {
                case 'CzmlDataSource' :
                    viewer.dataSources.add(Cesium.CzmlDataSource.load('datas/satellites.czml'));
                    viewer.camera.flyHome(0);
                    break;
                case 'WebGLGlobeDataSource' :
                    require(['models/WebGLGlobeDataSource'],function(WebGLGlobeDataSource){
                       var dataSource = new WebGLGlobeDataSource();
                       dataSource.loadUrl('datas/population909500.json').then(function() {
                           
                       });

                       viewer.clock.shouldAnimate = false;
                       viewer.dataSources.add(dataSource);
                    });
                    break;
                case 'Typhoon':
                    require(['models/getStuff'],function(getStuff){
                        var gPoints = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection()),
                            fnum = '00',
                            times = 0;

                        var typhoonTimer = setInterval(function () {
                            fnum = parseInt(fnum) + 3;
                            if (fnum > 36) {
                                times++;
                                fnum = '03';
                                console.log(times);
                            } else if (fnum < 10) {
                                fnum = '0' + fnum;
                            }
                            console.log(fnum);
                            getStuff(viewer, 'datas/typhoon/HWRFtest' + fnum + '.json', gPoints);
                            if (times > 3)
                                clearInterval(typhoonTimer);
                        }, 10000);
                    });
                    break;
                default :
                    break;
            }



        }

    });
    return VisualLayerModel;
});