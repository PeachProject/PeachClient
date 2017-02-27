require("./GenericMenu.js")

/**
 * The hardcoded implementation of the GenericMenu for the left main menu
 */
var MainMenuHandler = (function(){
    var s;
    return {
        settings: {
            navigationIdentifier: ".navigation_ul",
            menuItemCreator: function()
            {
                var dom = $("<li></li>");
                dom.addClass(this.itemClass);
                if(this.itemClass == "storage")
                {
                    //Special case!
                    var containerDom = $("<div></div>", {class: "storage_li_content"});
                    var icon = this.icon;
                    if(typeof icon !== typeof undefined)
                    {
                        var iconDom = $("<i></i>", {class: ["material-icons menu_icon"]}).html(icon);
                        containerDom.append(iconDom);
                    }
                    containerDom.append(this.content);
                    var submenu = $("<ul></ul>", {class: "storage_submenu"});

                    dom.append(containerDom);
                    dom.append(submenu);
                    return dom;
                }
                var icon = this.icon;
                if(typeof icon !== typeof undefined)
                {
                    var iconDom = $("<i></i>", {class: ["material-icons menu_icon"]}).html(icon);
                    dom.append(iconDom);
                }
                dom.append(this.content);
                return dom;
            },
            menuItems: [
                {
                    itemClass: "storage",
                    content: "Storage",
                    icon: "folder",
                    onSelect: function(){
                        if(typeof StorageSubMenu !== typeof undefined && StorageSubMenu.initialized)
                        {
                            StorageSubMenu.parentSelected.bind(StorageSubMenu)();
                        }
                    },
                    onDeselect: function(){
                        if(typeof StorageSubMenu !== typeof undefined && StorageSubMenu.initialized)
                        {
                            StorageSubMenu.parentDeselected.bind(StorageSubMenu)();
                        }
                    }
                },
                {
                    itemClass: "queue",
                    content: "Queue",
                    icon: "list",
                    onSelect: function(){
                        $(".queue_view").addClass("active");
                    },
                    onDeselect: function(){
                        $(".queue_view").removeClass("active");
                    }
                },
                {
                    itemClass: "logout",
                    content: "Logout",
                    onSelect: function() {
                        LogoutManager.logout();
                    },
                    onDeselect: function() {
                    }
                }
            ],
        },

        init: function(customSettings)
        {
            this.s = $.extend( {}, this.settings, customSettings);
            $(this.s.navigationIdentifier).genericMenu({
                menuItemCreator: this.s.menuItemCreator,
                menuItems: this.s.menuItems,
                currentItemClass: "active",
                currentElement: 0,
                defaultEvent: "click",
                deselectOnReselect: true,
                ignoreReselect: false
            });
        },

        changeToTab: function(tab)
        {
            if($(this.s.navigationIdentifier).genericMenu("option", "currentElement") != tab)
            $(this.s.navigationIdentifier).genericMenu("onSelect", tab);
        }
    }
})();

module.exports = MainMenuHandler;