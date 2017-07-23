define(['./Container','jquery','bootstrapTree'],function(Container,$,bootstrapTree){
    "use strict";
    var _ = require('underscore');
    var htmlStr = [
        "<div class='layermanager-container' >",
        "<div id='layerTree'></div>",
        "</div>"
    ].join('');
    var LayerManageDropDown = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        initialize : function(options){
            this.model = options.sceneModel;
            this.render();
            var me = this;
            this.listenTo(this.model, 'layerAdded', function(layerModel) {
                me.addTreeNode(layerModel);
            });
            this.listenTo(this.model, 'markerAdded', function(name) {
                me.addMarkerNode(name);
            });
            var men = this;
            this.once('componentAdded',function(parent){
                me.initZtree();
            });

        },
        render : function(){
            this.$el.html(this.template());
            this.$el.css({'height' : '100%'});
            return this;
        },
        toggleDropDown : function(){
            if($('.layermanager-container').hasClass('layermanager-container-visible')){
                $('.layermanager-container').removeClass('layermanager-container-visible');
            }
            else{
                $('.layermanager-container').addClass('layermanager-container-visible');
            }
        },
        initZtree : function(){
        	var me = this;
            var $tree = $('#layerTree').treeview({
                data: [{text : '图层列表',selectable : false}],
                showIcon: false,
                showCheckbox: true,
                backColor : 'transparent',
                color : '#fff',
                onNodeChecked : function(evt,node){
                	var layerModel = node.layerModel;
                	layerModel && layerModel.setVisible(true);
                }, 
                onNodeUnchecked : function(evt,node){
                	var layerModel = node.layerModel;
                	layerModel && layerModel.setVisible(false);
                },
                onNodeRemove : function(evt,node){
                	var layerModel = node.layerModel;
                	if(!layerModel){
                		return;
                	}
                	if(confirm("是否确定删除该图层？")){
                		var pId = node.parentId;
                		var pNode = $('#layerTree').treeview('getNode',[pId]);
                		var len = pNode.nodes.length;
                		$('#layerTree').treeview('removeNode',[node]);
                		var type = node.layerModel.get('type');
                		if(1 === len) {
                			if('MARKER' == type){
                    			me.model.defaultKmlLayer = undefined;
                    			var ppNode = $('#layerTree').treeview('getNode',[pNode.parentId]);
                    			if(ppNode.nodes.length === 1){
                    				$('#layerTree').treeview('removeNode',[ppNode]);
                    				delete me.rootNode['KML'];
                    			}
                    			$('#layerTree').treeview('removeNode',[pNode]);
                    			delete me.rootNode['default KML'];
                    		}
                			else{
                				$('#layerTree').treeview('removeNode',[pNode]);
                    			delete me.rootNode[type];
                			}
                		}
                		if('MARKER' === type){
                    		me.model.removeMarker(node.layerModel);
                    	}
                    	else{
                    		me.model.removeLayer(node.layerModel);
                    	}
                    }
                },
                onNodeSelected : function (evt,node) {
                	var layerModel = node.layerModel;
                	layerModel && layerModel.flyTo();
                }
            });
            this.rootNode = {};
            this.rootNode['root'] = $tree.treeview('getNode',0);
            this.tree = $tree;
        },
        addTreeNode : function(layerModel){
            var type = layerModel.get('type');
            var name = layerModel.get('name')
            if(!this.rootNode[type]){
                var nodeName = KeyMap[type];
                this.rootNode[type] = this.tree.treeview('addNode',[this.rootNode.root,{text : nodeName,selectable : false}]);
            }
            var childNode = this.tree.treeview('addNode',[this.rootNode[type],{text : name,showDel : true}]);
            childNode.layerModel = layerModel;
            if(name == 'default KML'){
            	this.rootNode[name] = childNode;
            	childNode.selectable = false;
            	childNode.showDel = false;
            	
            }
        },
        addMarkerNode : function(markerModel){
        	var name = markerModel.get('name');
        	var kmlRootNode = this.rootNode['default KML'];
        	if(!kmlRootNode){
        		return ;
        	}
        	var childNode = this.tree.treeview('addNode',[kmlRootNode,{text : name,showDel : true}]);
            childNode.layerModel = markerModel;
        }
    });
    var KeyMap = {
        'S3M' : 'S3M图层',
        'IMAGERY' : '影像图层',
        'TERRAIN' : '地形图层',
        'KML' : 'KML图层',
        'MARKER' : 'MARKER图层'
    };
    return LayerManageDropDown;
});