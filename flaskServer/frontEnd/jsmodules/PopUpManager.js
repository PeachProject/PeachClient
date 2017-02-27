var PopUpManager = (function(){
    var s;
    return {
        settings: {
            identifier: "#popup",
            contentIdentifier: "#popup_content",
            activeClass: "active",
            autoClose: true
        },

        init: function(customSettings)
        {
            this.s = $.extend( {}, this.settings, customSettings);
            this.bindUIActions();
        },

        bindUIActions: function()
        {
            if(this.s.autoClose === true)
            {
                $(this.s.identifier).on("click", this.close.bind(this));
                $(this.s.contentIdentifier).on("click", function(e){
                    e.stopPropagation();
                });
            }
        },

        show: function(contentDom)
        {
            $(this.s.contentIdentifier).html("");
            $(this.s.contentIdentifier).append(contentDom);
            $(this.s.identifier).addClass(this.s.activeClass);
        },

        close: function()
        {
            $(this.s.contentIdentifier).html("");
            $(this.s.identifier).removeClass(this.s.activeClass);
        },

        isOpen: function()
        {
            return $(this.s.identifier).hasClass(this.s.activeClass);
        }
    }
})();

module.exports = PopUpManager;