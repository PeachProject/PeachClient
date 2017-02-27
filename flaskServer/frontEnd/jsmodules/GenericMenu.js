require("./inc/jquery/jquery.js")

/**
 * Example usage:
 * $("ul.navigation").genericMenu({
 *      menuItemCreator: function(){
 *          return $("<li></li>", {class: "menuItem"}).html(this.content);
 *      },
 *      menuItems: [
 *          {
 *              content: "Home",
 *              onSelect: function(){
 *                  showHome();
 *              },
 *              onDeselect: function(){
 *                  hideHome();
 *              }
 *          },
 *          {
 *              content: "Contact",
 *              onSelect: function() {
 *                  showContact();
 *              },
 *              onDeselect: function() {
 *                  hideContact();
 *              },
 *              dom: $(".contact, footer .content"), //avoids automatic creation
 *              customEvent: "hover"
 *          } 
 *      ],
 *      currentItemClass: "active",
 *      defaultEvent: "dblclick",
 *      currentElement: 1
 * });
 */
$.widget("peach.genericMenu", {
    options: {
        menuItemCreator: function(param) { return undefined; },
        menuItems: {},
        currentItemClass: "active",
        defaultEvent: "click",
        currentElement: 0,
        prevElement: -1,
        deselectOnReselect: false,
        ignoreReselect: true,
        stopPropagation: true
    },

    _addMenuItem: function(menuItem) 
    {
        this.element.append(menuItem.dom);
    },

    _create: function()
    {
        this._update();
    },

    bindUIActions: function()
    {
        for(var i = 0;i < this.options.menuItems.length; ++i)
        {
            this.bindUIAction(this.options.menuItems[i], i);
        }
    },

    bindUIAction: function(menuItem, index)
    {
        var event = (typeof menuItem.customEvent !== typeof undefined)?(menuItem.customEvent):this.options.defaultEvent;
        menuItem.dom.attr("index", index.toString());
        menuItem.dom.on(event, (function(e){
            this.onSelect(index);
            if(this.options.stopPropagation) e.stopPropagation();
        }).bind(this));
    },

    onSelect: function(i)
    {
        var endIndex = i;
        if(this.options.currentElement === endIndex && this.options.ignoreReselect)
        {
            return;
        }else if(this.options.currentElement === endIndex && this.options.deselectOnReselect)
        {
            endIndex = -1;
        }
        this.options.prevElement = this.options.currentElement;
        this.options.currentElement = endIndex;
        this._updateIndex();
    },

    _update: function()
    {
        this.element.html("");
        for(var i = 0;i < this.options.menuItems.length; ++i)
        {
            var menuItem = this.options.menuItems[i];
            if(typeof menuItem.dom === typeof undefined)
            {
                menuItem.dom = this.options.menuItemCreator.bind(menuItem)(menuItem);
            }
            this._addMenuItem(menuItem);
        }
        this._updateIndex();
        this.bindUIActions();
    },

    _updateIndex: function()
    {
        var prevMenuItem = this.options.menuItems[this.options.prevElement];
        this._deactivateItem(prevMenuItem);
        
        var currentMenuItem = this.options.menuItems[this.options.currentElement];
        this._activateItem(currentMenuItem);
    },

    _deactivateItem: function(menuItem)
    {
        if(typeof menuItem === typeof undefined)
            return;

        if(typeof menuItem.onDeselect === typeof undefined)
            return;
        
        menuItem.onDeselect.bind(menuItem)(menuItem);
        menuItem.dom.removeClass(this.options.currentItemClass);
    },

    _activateItem: function(menuItem)
    {
        if(typeof menuItem === typeof undefined)
            return;

        menuItem.dom.addClass(this.options.currentItemClass);
        if(typeof menuItem.onSelect === typeof undefined)
            return;
        
        menuItem.onSelect.bind(menuItem)(menuItem);
    },

    _setOption: function(key, value)
    {
        if(key === "currentElement")
        {
            this.options.prevElement = this.options.currentElement;
            this._super(key, value);
            this._updateIndex();
            return;
        }
        this._super(key, value);
        this._update();
    },

    _setOptions: function(options) 
    {
        this._super(options);
        this._update();
    }
});