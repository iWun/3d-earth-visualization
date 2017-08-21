define(['backbone','./TileLayerModel'],function(Backbone,TileLayerModel){
    var TileLayerCollection = Backbone.Collection.extend({
        model : TileLayerModel,
        initialize : function(){
        },
        fetch : function(){
            var models = [
                new TileLayerModel({
                    url : 'datas/nyc/tileset_min.json',
                    name : 'Image',
                    thumbnail : 'images/data/nyc.png',
                    title : '纽约市',
                    type : 'nyc'
                }),
                new TileLayerModel({
				    url : 'datas/changsha/tileset_min.json',
				    name : 'Image',
				    thumbnail : 'images/data/cs.png',
				    title : '芦溪镇',
				    type : 'luxi'
                }),
                new TileLayerModel({
                    url : 'datas/pnts/tileset.json',
                    name : 'Image',
                    thumbnail : 'images/data/pnts.png',
                    title : '点云数据',
                    type : 'pnts'
                })

            ];
            this.reset(models);
        }
    });
    return TileLayerCollection;
});