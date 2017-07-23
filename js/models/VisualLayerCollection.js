define(['backbone','./VisualLayerModel'],function(Backbone,VisualLayerModel){
    var VisualLayerCollection = Backbone.Collection.extend({
        model : VisualLayerModel,
        initialize : function(){
        },
        fetch : function(){
            var models = [
				new VisualLayerModel({
                    url : '',
				    name : '卫星轨迹可视化',
				    thumbnail : 'images/data/satellites.png',
				    title : '卫星轨迹可视化',
				    type : 'CzmlDataSource'
				}),
                new VisualLayerModel({
                    url : '',
                    name : '人口数量分布可视化',
                    thumbnail : 'images/data/population.png',
                    title : '人口数量分布可视化',
                    type : 'WebGLGlobeDataSource'
                }),
                new VisualLayerModel({
                    url : '',
                    name : '台风（尼伯特）可视化',
                    thumbnail : 'images/data/typhoon.png',
                    title : '台风（尼伯特）可视化',
                    type : 'Typhoon'
                })
            ];
            this.reset(models);
        }
    });
    return VisualLayerCollection;
});