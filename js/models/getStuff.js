define([], function () {
    'use strict';

    var levs = [30, 35, 40, 42.5, 45, 47.5, 50, 52.5, 55],
        lev = 0,
        gvals,
        glls,
        labs,
        lines;


    function pickColorFlipDBZ(val) {
        var fvar = val;//Math.floor((val-120)/20+1);
        if (fvar >= 55.0) {
            fvar = 1;
        } else if (fvar >= 52.5) {
            fvar = 2;
        } else if (fvar >= 50.0) {
            fvar = 3;
        } else if (fvar >= 47.5) {
            fvar = 4;
        } else if (fvar >= 45.0) {
            fvar = 5;
        } else if (fvar >= 42.5) {
            fvar = 6;
        } else if (fvar >= 40.0) {
            fvar = 7;
        } else if (fvar >= 35.0) {
            fvar = 8;
        } else if (fvar >= 30.0) {
            fvar = 9;
        } else {
            fvar = 0;
        }
        return fvar;
    };

    function getStuff(viewer, fn, gPoints) {
        var allShow = false;
        if (labs) {
            if (!labs.isDestroyed()) {
                if (labs.get(0).show) {
                    allShow = true;
                }
            }
        }

        var clrs = [new Cesium.Color(255 / 255, 255 / 55, 255 / 255, 0.0), new Cesium.Color(255 / 255, 255 / 255, 217 / 255, 1.0), new Cesium.Color(237 / 255, 248 / 255, 177 / 255, 1.0), new Cesium.Color(199 / 255, 233 / 255, 180 / 255, 1.0), new Cesium.Color(127 / 255, 205 / 255, 187 / 255, 1.0), new Cesium.Color(65 / 255, 182 / 255, 196 / 255, 1.0), new Cesium.Color(29 / 255, 145 / 255, 192 / 255, 1.0), new Cesium.Color(34 / 255, 94 / 255, 168 / 255, 1.0), new Cesium.Color(37 / 255, 52 / 255, 148 / 255, 1.0), new Cesium.Color(8 / 255, 29 / 255, 88 / 255, 1.0)];
        $.ajax({
            url: fn,
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    console.log(data.error);
                    return false;
                }
                glls = data.lls;
                gvals = data.vals;
                if (gPoints.isDestroyed()) {
                    gPoints = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
                }
                var clr;
                var pt;
                var sbd = new Cesium.NearFarScalar(2e6, 1.5, 1.5e7, 0.2);
                for (var i = 0; i < gvals.length; i++) {
                    clr = pickColorFlipDBZ(gvals[i]);
                    var shw = true;
                    if (gvals[i] < levs[lev]) {
                        shw = false;
                    }
                    if (i < gPoints.length) {
                        pt = gPoints.get(i);
                        pt.position = new Cesium.Cartesian3.fromDegrees(glls[i][0], glls[i][1], glls[i][2]);
                        pt.color = clrs[clr];
                        //pt.outlineColor = clrs[clr];
                        pt.outlineWidth = 0.0;
                        pt.show = shw;
                    } else {
                        gPoints.add({
                            position: new Cesium.Cartesian3.fromDegrees(glls[i][0], glls[i][1], glls[i][2]),
                            color: clrs[clr],
                            pixelSize: 1.0,
                            scaleByDistance: sbd,
                            //outlineColor: clrs[clr],
                            outlineWidth: 0.0,
                            show: shw
                        });
                    }
                }
                if (gvals.length < gPoints.length) {
                    for (var z = gvals.length; z < gPoints.length; z++) {
                        gPoints.get(z).show = false;
                    }
                }

            },
            error: function (e) {
                console.log(e);
                JSON.parse(e.responseText);
            }
        });
    };

    return getStuff;
});