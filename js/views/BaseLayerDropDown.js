define(['./Container','../models/BaseLayerCollection','./ThumbGroup'],function(Container,BaseLayerCollection,ThumbGroup){
    "use strict";
    var _ = require('underscore');
    var $ = require('jquery');
    var htmlStr = [
        '<div id="baseLayerGroup">',
        '</div>',
        '<div>',
            '<input id="chkTerrain" type="checkbox" style="width: 16px;height: 16px;margin-left: 10px;vertical-align: text-bottom">',
            '<span style="margin-bottom: 15px;margin-left: 5px;">STK Terrain</span>',
        '</div>'
    ].join('');
    var BaseLayerDropDown = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
        	'change #chkTerrain' : 'onChkTerrain'
        },
        initialize : function(options){
        	this.model = options.sceneModel;
            var layerCollection = new BaseLayerCollection();
            var thumbGroup = new ThumbGroup({
                collection : layerCollection,
                isDefaultSelected : true
            });
            layerCollection.fetch();
            this.thumbGroup = thumbGroup;
            var me = this;
            this.listenTo(thumbGroup, 'thumbClicked', function(model) {
                me.model.setBaseLayer(model);
                me.$el.hide();
            });
            this.on('componentAdded',function(parent){
            	me.addComponent(thumbGroup);
            });
            this.render();
            var btnEl = document.getElementById('baseLayerBtn');
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
            this.$el.addClass('baselayer-container');
            var container = this.$('#baseLayerGroup');
            this.setContainerElement(container);
            return this;
        },
        onChkTerrain : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	var isStkTerrain = $("#chkTerrain").is(':checked');
        	this.model.setTerrain(isStkTerrain);
        	this.$el.hide();
        	if ( evt && evt.stopPropagation ) {
        		evt.stopPropagation();
        	}
        		 
        	else{
        		window.event.cancelBubble = true;
        	}
        }
    });
    return BaseLayerDropDown;
});