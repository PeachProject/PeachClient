require("./inc/jquery/jquery.js")

var OptionMenuManager = (function(){
    var s;
    return {
        settings: 
        {
            menuButtonIdentifier: ".option_menu_button",
            optionMenuIdentifierAttribute: "for",
            openedButtonClass: "active",
            openedMenuClass: "active",
            autoPositioning: true
        },

        init: function(customSettings)
        {
            s = this.settings;
            for (name in customSettings) {
                s[name] = customSettings[name];
            }
            this.bindUIActions();
        },

        bindUIActions: function()
        {
            $(s.menuButtonIdentifier).on("click", function(){
                OptionMenuManager.updateView($(this));
            });
        },

        updateView: function(buttonDom)
        {
            optionMenuIdentifier = buttonDom.attr(s.optionMenuIdentifierAttribute);
            optionMenuDom = $(optionMenuIdentifier);
            if(optionMenuDom.hasClass(s.openedMenuClass))
            {
                //Let's close this
                this.closeMenu(buttonDom, optionMenuDom);
            }else
            {
                this.openMenu(buttonDom, optionMenuDom);
            }
        },

        closeMenu: function(buttonDom, menuDom)
        {
            buttonDom.removeClass(s.openedButtonClass);
            menuDom.removeClass(s.openedMenuClass);
        },

        openMenu: function(buttonDom, menuDom)
        {
            buttonDom.addClass(s.openedButtonClass);
            if(s.autoPositioning)
                this.autoPosition(buttonDom, menuDom);
            menuDom.addClass(s.openedMenuClass);
        },

        autoPosition: function(buttonDom, menuDom)
        {
            menuDom.css({"position": "absolute"});
            menuDom.css({"right": $(window).width() - buttonDom.offset().left});
            menuDom.css({"top": buttonDom.height() + buttonDom.offset().top});
        }
    }
})();

module.exports = OptionMenuManager;