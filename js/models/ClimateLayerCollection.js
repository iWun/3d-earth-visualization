define(['backbone','./ClimateLayerModel'],function(Backbone,ClimateLayerModel){
    var ClimateLayerCollection = Backbone.Collection.extend({
        model : ClimateLayerModel,
        initialize : function(){
        },
        fetch : function(){
            var models = [
				new ClimateLayerModel({
                    url : '//re.ssec.wisc.edu/api/image?products=SSEC-globalirott&x={x}&y={y}&z={z}',
				    name : '',
				    thumbnail : 'images/data/overshooting.png',
				    title : 'Infrared, Overshooting Tops (hourly)',
				    type : 'Overshooting Tops'
				}),
                new ClimateLayerModel({
                    url : '//re.ssec.wisc.edu/api/image?products=SSEC-globalirfunk&x={x}&y={y}&z={z}',
                    name : '',
                    thumbnail : 'images/data/funktop.png',
                    title : 'Infrared, FunkTop (hourly)',
                    type : 'FunkTop'
                }),
                new ClimateLayerModel({
                    url : '//re.ssec.wisc.edu/api/image?products=SSEC-globalirbd&x={x}&y={y}&z={z}',
                    name : '',
                    thumbnail : 'images/data/dvorak.png',
                    title : 'Infrared, Dvorak (hourly)',
                    type : 'Dvorak'
                }),
                new ClimateLayerModel({
                    url : '//re.ssec.wisc.edu/api/image?products=SSEC-globalwvgrad&x={x}&y={y}&z={z}',
                    name : '',
                    thumbnail : 'images/data/vapor.png',
                    title : 'Water Vapor (hourly)',
                    type : 'Water Vapor'
                }),
                new ClimateLayerModel({
                    url : '//re.ssec.wisc.edu/api/image?products=SSEC-globaliravn&x={x}&y={y}&z={z}',
                    name : '',
                    thumbnail : 'images/data/avn.png',
                    title : 'Infrared, AVN (hourly)',
                    type : 'AVN'
                })
            ];
            this.reset(models);
        }
    });
    return ClimateLayerCollection;
});