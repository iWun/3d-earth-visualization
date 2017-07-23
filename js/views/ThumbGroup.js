define(['./Container','jquery','./ThumbnailItem'],function(Container,$,ThumbnailItem){
    var _ = require('underscore');
    var ThumbGroup = Container.extend({
        tagName : 'div',
        className : 'service-items',
        initialize : function(options){
            this.collection = options.collection;
            this.isDefaultSelected = options.isDefaultSelected;
            this.collection.on("reset", this.render, this);
        },
        render : function(){
            var me = this;
            var isDefaultSelected = this.isDefaultSelected;
            me.$el.empty();
            this.collection.each(function(item, idx) {
                var thumbnail = new ThumbnailItem({
                    model : item,
                    isDefaultSelected : isDefaultSelected
                });
                me.listenTo(thumbnail, 'thumbClicked', function(model) {
                    me.trigger('thumbClicked', model);
                });
                me.$el.append(thumbnail.render().$el);
                if(idx === 0 && isDefaultSelected){
                	thumbnail.iconEl.addClass('service-itemIcon-selected');
                }
            });
        }
    });
    return ThumbGroup;
});