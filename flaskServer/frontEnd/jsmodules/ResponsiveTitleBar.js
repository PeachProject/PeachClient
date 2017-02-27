require("./inc/jquery/jquery.js")

var ResponsiveTitleBar = (function(){
    var s;
    return {
        settings: {
            titlebarIdentifier: ".title_bar",
            actionButtonsIdentifier: ".action_buttons",
            classForHiding: "hidden",
            minWidthAttr: "minwidthforaction",
            alternativeAttr: "alternativeActionButtons"
        },

        init: function(customSettings = {})
        {
            this.s = this.settings;
            for (name in customSettings) {
                this.s[name] = customSettings[name];
            }
            this.bindUIActions();
        },

        bindUIActions: function()
        {
            var titlebarIdentifier = this.s.titlebarIdentifier;
            $(window).on("load", function(){
                $(titlebarIdentifier).each(function(index, value){ResponsiveTitleBar.update($(this));});
            });
            //Attention: could be depricated in a few years...
            $(document.body).bind("DOMSubtreeModified", function(){
                $(titlebarIdentifier).each(function(index, value){ResponsiveTitleBar.update($(this));});
            });
        },

        update: function(dom)
        {
            var actionButtons = dom.find(this.s.actionButtonsIdentifier);
            var minWidth = dom.attr(this.s.minWidthAttr);
            var alternativeId = dom.attr(this.s.alternativeAttr);

            if(minWidth === typeof undefined || minWidth === false)
            {
                return;
            }

            if(dom.width() < minWidth)
            {
                actionButtons.addClass(this.s.classForHiding);
                if(alternativeId !== typeof undefined && alternativeId !== false)
                {
                    $(alternativeId).removeClass(this.s.classForHiding);
                }
            }else
            {
                actionButtons.removeClass(this.s.classForHiding);
                if(alternativeId !== typeof undefined && alternativeId !== false)
                {
                    $(alternativeId).addClass(this.s.classForHiding);
                }
            }
        }
    }
})();

module.exports = ResponsiveTitleBar;