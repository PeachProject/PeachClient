require("./inc/jquery/jquery.js")

var ActionView = function(){
    var s;
    var dom;
    var actionButtons;
    var events;
    var globalEvent;
    return {
        settings: {
            identifier: "",
            actionButtonIdentifier: ".action_buttons li",
            hideClass: "hidden",
            hideOnStart: true,
            actionIdentifierAttribute: "action"
        }, 

        init: function(customSettings = {})
        {
            this.s = this.settings;
            for (name in customSettings) {
                this.s[name] = customSettings[name];
            }
            this.dom = $(this.s.identifier);
            this.actionButtons = $(this.s.actionButtonIdentifier);
            if(this.s.hideOnStart)
            {
                this.deactivateAll();
            }
        },

        setEvents: function(ev)
        {
            this.events = ev;
            this.bindUIActions();            
        },

        setGlobalEvent: function(ev)
        {
            this.globalEvent = ev;
            this.bindUIActions();
        },

        bindUIActions: function()
        {
            var s = this.s;   
            var events = this.events;
            var triggerEventFct = this.triggerEvent.bind(this);
            $.each(this.actionButtons, function(index, value){
                $(this).on("click", function(){
                    triggerEventFct($(this).attr(s.actionIdentifierAttribute));
                });
            });
        },

        triggerEvent: function(ev)
        {
            if(typeof this.events !== typeof undefined && typeof this.events[ev] !== typeof undefined)
            {
                this.events[ev]();
            }
            if(typeof this.globalEvent !== typeof undefined)
            {
                this.globalEvent(ev);
            }
        },

        activeAll: function()
        {
            this.changeAll(false);
        },

        activate: function(actionIdentifiers, append = false)
        {
            if(!append)
            {
                this.deactivateAll();
            }
            var s = this.s;
            $.each(this.actionButtons, function(index, value){
                if($.inArray($(this).attr(s.actionIdentifierAttribute), actionIdentifiers) >= 0)
                {
                    
                    $(this).removeClass(s.hideClass);
                }
            });
        },

        deactivateAll: function()
        {
            this.changeAll(true);
        },

        changeAll: function(hide = false)
        {
            var hideClass = this.s.hideClass;
            $.each(this.actionButtons, function(index, value){
                if(hide)
                {
                    $(this).addClass(hideClass);
                }else
                {
                    $(this).removeClass(hideClass);
                }
            });
        }
    }
};

module.exports = ActionView;