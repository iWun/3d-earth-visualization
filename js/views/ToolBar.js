define([
    "./Container",
    '../tools/Position'
    ], function(
    Container,
    Position
    ) {
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        "<div class='btn-group' style='margin: 5px 5px 5px 8px;'>",
        "<a id='expandBtn' class='btn btn-inverse'><span class='fui-arrow-left'></span></a>",
        "<a id='baseLayerBtn' class='btn btn-inverse'><span class='fui-list-large-thumbnails'></span></a>",
        "<a id='addLayerBtn' class='btn btn-inverse'><span class='fui-plus-circle'></span></a>",
        "<a id='visualBtn' class='btn btn-inverse'><span class='fui-eye'></span></a>",
        "<a id='climateBtn' class='btn btn-inverse'><span class='fui-star'></span></a>",
        "<a id='settingBtn' class='btn btn-inverse'><span class='fui-gear'></span></a>",
        "</div>"
        ].join('');
    var ToolBar = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
            'click #expandBtn' : 'onExpandBtnClk',
            'click #addLayerBtn' : 'onAddLayerBtnClk',
            'click #baseLayerBtn' : 'onBaseLayerBtnClk',
            'click #visualBtn' : 'onVisualBtnClk',
            'click #climateBtn' : 'onClimateBtnClk',
            'click #settingBtn' : 'onSettingBtnClk'
        },
        initialize : function(options) {
            this.model = options.sceneModel;
            this.isPCBroswer = options.isPCBroswer;
            this.render();
            this.on('componentAdded',function(parent){
                if(parent){
                	this.parent = parent;
                    // var bubble = new Bubble({
                    // 	sceneModel : options.sceneModel
                    // });
                    // parent.addComponent(bubble,new Position({
                    //     x : '0',
                    //     y : '0'
                    // }));
                    // this.bubble = bubble;

                }
            });
        },
        render : function() {
            this.$el.addClass('btn-toolbar');
            this.$el.html(this.template());
            return this;
        },
        onExpandBtnClk : function(evt) {
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            var $span = $('#expandBtn span');
            if($span){
                if($span.hasClass('fui-arrow-left')){
                    $span.removeClass('fui-arrow-left').addClass('fui-arrow-right');
                    $('#expandBtn').nextAll().hide();
                }
                else{
                    $span.removeClass('fui-arrow-right').addClass('fui-arrow-left');
                    $('#expandBtn').nextAll().show();
                    if(!this.isPCBroswer){
    	            	$('#addMarkerBtn').hide();
    	            	$('#measureBtn').hide();
    	            }
                }
            }
            return false;
        },
        onAddLayerBtnClk : function (evt) {

            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            if(this.TileLayerDropDown){
                this.TileLayerDropDown.$el.toggle();
            }
            else{
                var me = this;
                require(['./views/TileLayerDropDown'],function(TileLayerDropDown){
                    var TileLayerDropDown = new TileLayerDropDown({
                        sceneModel : me.model
                    });
                    me.parent.addComponent(TileLayerDropDown);
                    me.TileLayerDropDown = TileLayerDropDown;
                    me.TileLayerDropDown.$el.toggle();
                });
            }
            return false;

        },
        onBaseLayerBtnClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
            if(this.baselayerDropDown){
                this.baselayerDropDown.$el.toggle();
            }
            else{
            	var me = this;
            	require(['./views/BaseLayerDropDown'],function(BaseLayerDropDown){
            		var baseLayerDropDown = new BaseLayerDropDown({
                        sceneModel : me.model
                    });
                    me.parent.addComponent(baseLayerDropDown);
                    me.baselayerDropDown = baseLayerDropDown;
                    me.baselayerDropDown.$el.toggle();
            	});
            }
            return false;
        },
        onVisualBtnClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	if(this.visualDropDown){
        		this.visualDropDown.$el.toggle();
        	}
        	else{
                var me = this;
                require(['./views/visualDropDown'],function(visualDropDown){
                    var visualDropDown = new visualDropDown({
                        sceneModel : me.model
                    });
                    me.parent.addComponent(visualDropDown);
                    me.visualDropDown = visualDropDown;
                    me.visualDropDown.$el.toggle();
                });
        	}
        	return false;
        },

        onClimateBtnClk : function(evt){
            if(evt && evt.preventDefault){
                evt.preventDefault();
            }
            else{
                window.event.returnValue = false;
            }
            if(this.climateDropDown){
                this.climateDropDown.$el.toggle();
            }
            else{
                var me = this;
                require(['./views/climateDropDown'],function(climateDropDown){
                    var climateDropDown = new climateDropDown({
                        sceneModel : me.model
                    });
                    me.parent.addComponent(climateDropDown);
                    me.climateDropDown = climateDropDown;
                    me.climateDropDown.$el.toggle();
                });
            }
            return false;
        },
        
        onSettingBtnClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	if(this.settingDropDown){
                this.settingDropDown.$el.toggle();
            }else {
            	var me = this;
            	require(['./views/SettingDropDown'],function(SettingDropDown){
            		var settingDropDown = new SettingDropDown({
                        sceneModel : me.model
                    });
                    me.parent.addComponent(settingDropDown);
                    me.settingDropDown = settingDropDown;
                    me.settingDropDown.$el.toggle();
            	});
            }
            return false;
        }

    });
    return ToolBar;
});
