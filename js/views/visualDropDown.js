define(['./Container','../models/VisualLayerCollection','./ThumbGroup'],function(Container,VisualLayerCollection,ThumbGroup){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        '<div id="viusalLayerGroup">',
        '</div>'
    ].join('');
    var visualDropDown = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        initialize : function(options){
        	this.model = options.sceneModel;
            var layerCollection = new VisualLayerCollection();
            var thumbGroup = new ThumbGroup({
                collection : layerCollection,
                isDefaultSelected : false
            });
            layerCollection.fetch();
            this.thumbGroup = thumbGroup;
            var me = this;
            this.listenTo(thumbGroup, 'thumbClicked', function(model) {
                me.model.visualize(model);
                me.$el.hide();
            });
            this.on('componentAdded',function(parent){
            	me.addComponent(thumbGroup);
            });
            this.render();
            var btnEl = document.getElementById('visualBtn');
            $(document).on('click touchstart',function(e){
            	if(btnEl.contains(e.target)){
            		return;
            	}
            	var el = me.el;
            	if (!( el.contains(e.target) )) {
            		me.$el.hide();
                }
            });
        },
        render : function(){
            this.$el.html(this.template());
            this.$el.addClass('visuallayer-container');
            var container = this.$('#viusalLayerGroup');
            this.setContainerElement(container);
            return this;
        }
    });
    return visualDropDown;
});