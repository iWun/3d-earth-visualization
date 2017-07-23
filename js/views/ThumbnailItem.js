define(['backbone','jquery'],function(Backbone,$){
    var _ = require('underscore');
    var htmlStr = [
        '<div class="service-item">',
        '<img class="service-itemIcon" src="<%- thumbnail %>" title="<%- title%>">',
        '<div class="service-itemLabel"><%- title%></div>',
        '</div>'
    ].join('');
    var ThumbnailItem = Backbone.View.extend({
        template : _.template(htmlStr),
        tagName : 'div',
        className : 'service-item',
        events : {
            'click img' : 'onThumbnailClk'
        },
        initialize : function(options){
            this.model = options.model;
            this.isDefaultSelected = options.isDefaultSelected;
        },
        render : function(){
            var json = this.model.toJSON();
            this.$el.html(this.template(json));
            this.iconEl = this.$('img');
            this.labelEl = this.$('.service-itemLabel');
            var $img = this.$('img');
            $img.one('error', function() {
                $img.attr('src', './images/thumbnail.jpg');
            });
            return this;
        },
        onThumbnailClk : function(evt){
        	if(evt && evt.preventDefault){
        		evt.preventDefault();
            }
        	else{
                window.event.returnValue = false;
            }
        	if(this.isDefaultSelected){
        		if(this.iconEl.hasClass('service-itemIcon-selected')){
        			return;
        		}
        		this.$el.parent().find('img').each(function(){
        			var $this = $(this);
        			var isSelected = $this.hasClass('service-itemIcon-selected');
        			if(isSelected){
        				$this.removeClass('service-itemIcon-selected');
        			}
        		});
        		this.iconEl.addClass('service-itemIcon-selected');
        	}
            this.trigger('thumbClicked', this.model);
            return false;
        }
    });
    return ThumbnailItem;
});