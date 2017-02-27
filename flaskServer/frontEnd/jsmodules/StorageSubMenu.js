var StorageSubMenu = (function(){
    var s;
    var menuItems;
    var lastIndex;
    var initialized;
    var dom;
    return {
        settings: {
            identifier: ".navigation .navigation_ul .storage .storage_submenu",
            selectedAttr: "selectedtype"
        },
        init: function(customSettings)
        {
            this.s = $.extend( {}, this.settings, customSettings);
            this.initialized = true;
            this.lastIndex = -1;

            this.dom = $(this.s.identifier).genericMenu({
                deselectOnReselect: true,
                ignoreReselect: false,
                menuItemCreator: this.menuItemCreator,
                menuItems: this.menuItems,
                currentElement: -1,
                defaultEvent: "click",
                currentItemClass: "active"
            });
            this.updateMenuItems();
        },

        generatePlusItem: function()
        {
            var dom = this.dom;
            return {
                    plus: true,
                    onSelect: function ()
                    {
                        StorageSubMenu.requestConnectionAdd();
                        dom.genericMenu("option", "currentElement", -1);
                    },
                    onDeselect: function(){
                        
                    }
                }
            ;
        },

        requestConnectionAdd: function()
        {
            PopUpManager.show(this.createPopUpContent());
        },

        createPopUpContent: function()
        {
            var container = $("<div></div>", {class: "connection_selection_container"});
            
            var dropdown = $("<select></select>", {class: "default_input connection_type_selection"});

            for(var i = 0; i < ConnectionManager.getAllConnectionTypes().length; ++i)
            {
                var connectionType = ConnectionManager.getAllConnectionTypes()[i];
                var option = $("<option></option>", {class: "connection_type_item"}).html(connectionType.name).attr("typeid", connectionType.type).attr("value", connectionType.type);
                option.on("")
                dropdown.append(option);
            }

            var form = $("<form></form>", {class: "connection_form"});
            var connectorContainer = $("<div></div>", {class: "connection_connector_container"});

            

            form.append(connectorContainer);

            var submitButton = $("<input></input>", {class: "default_button"}).attr("type", "submit").val("CONNECT");
            form.append(submitButton)


            dropdown.on("change ready", function(){
                StorageSubMenu.connectionTypeSelected(this.value, connectorContainer);
            });

            form.on("submit", function(){
                console.log("submit");
                StorageSubMenu.connectionAddRequest(connectorContainer);
            });

            container.append(dropdown);
            container.append(form);

            StorageSubMenu.connectionTypeSelected("0", connectorContainer);


            return container;
        },

        connectionAddRequest: function(containerDom)
        {
            var selected = containerDom.attr(this.s.selectedAttr);
            if(typeof selected === typeof undefined)
            {
                //should actually never happen...
                return;
            }

            ConnectionManager.addConnection(containerDom, selected);
            PopUpManager.close();
            this.updateMenuItems();
        },

        connectionTypeSelected: function(type, containerToAdd)
        {
            containerToAdd.html("");
            containerToAdd.append(ConnectionManager.getConnectionTypeByTypeId(type).connectorView());
            containerToAdd.attr(this.s.selectedAttr, type);
        },

        menuItemCreator: function()
        {
            var dom = $("<li></li>", {class: ""});

            if(this.plus)
            {
                var plusDom = $("<div></div>", {class: "add_connection"}).html("playlist_add");
                dom.append(plusDom);
                return dom;
            }

            var content = $("<div></div>", {class: "connection_li_content"});
            content.html(this.title);

            dom.append(content);
            return dom;
        },

        updateMenuItems: function()
        {
            this.menuItems = [];
            for(var i = 0; i < ConnectionManager.getConnections().length; ++i)
            {
                var cConnection = ConnectionManager.getConnections()[i];
                var title = cConnection.head.title;
                var menuItem = this.createMenuItemForConnection(cConnection, i);
                this.menuItems.push(menuItem);
            }
            var plusItem = this.generatePlusItem();
            this.menuItems.push(plusItem);
            $(this.s.identifier).genericMenu("option", "menuItems", this.menuItems);
        },

        createMenuItemForConnection: function(connection, i)
        {
            return {
                title: connection.head.title,
                onSelect: function()
                {
                    StorageSubMenu.connectionSelected(i);
                },
                onDeselect: function()
                {
                    StorageSubMenu.connectionDeselected(i);
                },
                onRemove: function()
                {
                    StorageSubMenu.connectionRemoved(i);
                }
            }
        },

        connectionRemoved: function(i)
        {
            ConnectionManager.removeConnection(i);
            StorageSubMenu.updateMenuItems();
        },

        connectionSelected: function(i)
        {
            var connection = ConnectionManager.getConnections()[i];
            StorageManager.sendInitialRequest(connection);
        },

        connectionDeselected: function(i)
        {
            $(".storage_view").removeClass("active");
        },

        parentSelected: function()
        {
            if(typeof this.dom !== typeof undefined)
            {
                this.dom.genericMenu("option", "currentElement", this.lastIndex);
                $(".storage_view").addClass("active");
            }
        },

        parentDeselected: function()
        {
            if(typeof this.dom !== typeof undefined)
            {
                this.lastIndex = this.dom.genericMenu("option", "currentElement");
                this.dom.genericMenu("option", "currentElement", -1);
            }
        }
    }
})();

module.exports = StorageSubMenu;