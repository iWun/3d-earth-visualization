requirejs.config({
    waitSeconds : 60,
    paths : {
        Cesium : '../Build/Cesium/Cesium',
        Zlib : '../Build/Cesium/Workers/zlib.min',
        jquery : "lib/jquery.min",
        underscore : "lib/underscore-min.1.4.4",
        backbone : "lib/backbone-min",
        flatui : "lib/flat-ui.min",
        Config : 'Config',
        turf : 'lib/turf.min',
        bootstrapTree : 'lib/bootstrap-treeview'
    },
    shim : {
        underscore : {
            deps : [],
            exports : "_"
        },
        backbone : {
            deps : [ "jquery", "underscore" ],
            exports : "Backbone"
        },
        Cesium: {
            exports: 'Cesium'
        },
        Zlib : {
            exports : 'Zlib'
        },
        flatui : {
            deps : ['jquery'],
            exports : '$'
        },
        turf : {
        	exports : 'turf'
        },
        bootstrapTree : {
            exports : 'bootstrapTree'
        }

    }
});