require("./inc/jquery/jquery.js")

var StorageGUIItem = function(){
    var selected = false;
    var s;
    var dom;
    var iconDom;
    var nameDom;
    var onSelectListener;
    var onDeselectListener;
    var storageItem;
    var actionListener;


    return {
        settings:{
            folderType: "folder",
            iconDomSelector: ".storage_item_icon",
            nameDomSelector: ".storage_item_name",
            selectedClass: "selected"
        },
        
        init: function(theStorageItem, customSettings = {})
        {
            s = this.settings;
            for (name in customSettings) {
                s[name] = customSettings[name];
            }
            this.storageItem = theStorageItem;
            this.create();
            this.bindUIActions();
        },

        bindUIActions: function()
        {
            this.dom.on("dblclick", this.doDefaultAction.bind(this));
            this.dom.on("click", this.toggleSelection.bind(this));
        },

        getStorageIcon: function()
        {
            //TODO
            var imageExtensions = [
                "mha", "jpg", "jpeg", "png", "gif", "tiff"
            ];

            if(this.storageItem.type == "folder")
            {
                return "folder";
            }else if(this.storageItem.type == "project")
            {
                return "reorder";
            }else if(this.storageItem.type == "subject")
            {
                return "face";
            }else if(this.storageItem.type == "image_stack")
            {
                return "collections";
            }else if(this.storageItem.type == "stack")
            {
                return "layers";
            }
            else if(this.storageItem.type == "file")
            {
                console.log(this.storageItem.extension);
                if(this.storageItem.extension == "txt")
                {
                    return "format_align_left";
                }else if(this.storageItem.extension == "wf")
                {
                    return "linear_scale";
                }else if($.inArray(this.storageItem.extension, imageExtensions) >= 0)
                {
                    return "photo";
                }else
                {
                    return "insert_drive_file";
                }
            }
        },

        doDefaultAction: function()
        {
            //this.toggleSelection();
            this.selected = true;
            this.update();
            if(typeof this.onSelectListener !== typeof undefined)
                    this.onSelectListener(this);
            if(this.storageItem.rights.length > 0)
                this.actionListener(this.storageItem.rights[0]);
        },

        toggleSelection: function()
        {
            this.selected = !this.selected;
            this.update();         
            if(this.selected)
            {
                if(typeof this.onSelectListener !== typeof undefined)
                    this.onSelectListener(this);
            }else{
                if(typeof this.onDeselectListener !== typeof undefined)
                    this.onDeselectListener(this);
            }
        },

        create: function()
        {
            this.dom = $("<div>", {class: 'storage_item'});
            this.dom.attr("storageitemtype", this.storageItem.type);
            this.iconDom = $("<div>", {class: 'storage_item_icon'});
            this.dom.append(this.iconDom);
            this.nameDom = $("<div>", {class: 'storage_item_name'});
            this.dom.append(this.nameDom);
            if(this.type == s.folderType)
            {
                this.dom.addClass("storage_folder_item");
            }
            this.update();
        },

        setSelected: function(selectedParam = true)
        {
            this.selected = selectedParam;
            this.update();
        },

        update: function()
        {
            this.updateIcon();
            this.updateName();
            if(this.selected)
            {
                this.dom.addClass(s.selectedClass);
            }else
            {
                this.dom.removeClass(s.selectedClass);
            }
        },

        updateName: function()
        {
            this.nameDom.html(this.storageItem.name);
        },

        updateIcon: function()
        {
            this.iconDom.html(this.getStorageIcon());
        }
    }
};

var StorageManager = (function(){
    var s;
    var currentUriContent;
    var currentUriContentGUI;
    var currentlySelected;
    var actionView;

    var currentConnectionType;
    var currentURI;
    var currentActions;
    var sendingRequest = false;
    var parentActionButtons = [];

    return {
        settings: 
        {
            storageContainer: ".storage_content",
            storageViewIdentifier: ".storage_view",
            breadCrumpIdentifier: ".breadcrumbs",
            openFunctions: {
                wf: function(response){
                    window.globalWorkflow.loadFile(response);
                },
                py: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                js: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                html: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                txt: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                json: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                m: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                tex: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                h: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                cpp: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                },
                c: function(response)
                {
                    window.TextFileEditor.loadFile(response);
                }
            },
            defaultActionIcons: {
                open: "visibility",
                delete: "delete_forever",
                parent: "keyboard_return",
                upload: "note_add"
            },
            defaultActionName: {
                open: "Open",
                delete: "Delete",
                parent: "Parent Directory",
                upload: "Add file"
            },
            customActionFunctions: {
                upload: function()
                {
                    UploadManager.requestUpload((function(specification){
                        meta = [
                            {
                                key: "filename",
                                value: specification["filename"].replace(/\s/g , "_")
                            },
                            {
                                key: "content",
                                value: specification["content"]
                            }
                        ];
                        this.sendRequest(this.createRequest("upload", this.currentURI, meta));
                    }).bind(this));
                }
            },
            parentActionContainerIdentifier: "#storage_option_menu",
            defaultActions: {
                get_uri: function()
                {
                    var parent = $("<div></div>", {class: "uri_display_wrapper"});
                    var h1 = $("<h1></h1>").html("Uri");
                    var label = $("<label></label>").html("Copy the uri to use the selected file / folder in your workflows");
                    var input = $("<input></input>", {class: "default_input uri_input"}).attr("type", "text").attr("readonly", "true").val(this.currentlySelected.storageItem.uri);
                    
                    input.focus(function() {
                        var $this = $(this);
                        $this.select();

                        // Work around Chrome's little problem
                        $this.mouseup(function() {
                            // Prevent further mouseup intervention
                            $this.unbind("mouseup");
                            return false;
                        });
                    });
                    
                    parent.append(h1);
                    parent.append(label);
                    parent.append(input);
                    PopUpManager.show(parent);
                }
            }
        },

        init: function(startFolder, customSettings = {})
        {
            this.s = this.settings;
            for (name in customSettings) {
                s[name] = customSettings[name];
            }
            this.bindUIActions();

            //TODO: Maybe add a button to do this
            this.actionView = ActionView();
            this.actionView.init({
                "identifier": this.s.storageViewIdentifier,
                "actionButtonIdentifier": ".storage_action_buttons li"
            });
            this.actionView.setGlobalEvent(this.actionButtonPressed.bind(this));
        },

        getActionName: function(action)
        {
            return this.s.defaultActionName[action];
        },

        getActionIcon: function(action)
        {
            return this.s.defaultActionIcons[action];
        },

        sendInitialRequest: function(connection)
        {
            console.log(connection);
            //ajax send initial request!
            var body = connection.body; //This is what we will send!
            this.currentConnectionType = body.type;
            this.send(globalConfig["getInitialResponseURL"], {
                connection: JSON.stringify(body)
            });
        },

        send: function(url, d)
        {
            if(this.sendingRequest) return;
            this.sendingRequest = true;
            console.log("SENDING:\n" + JSON.stringify(d));
            $.ajax({
                url: url,
                data: d,
                type:  "POST",
                dataType: "json",
                success: this.receiveResponse.bind(this)
            });
        },

        bindUIActions: function()
        {
            // $(this.s.downloadCurrentFolderButton).on("click", this.downloadCurrentFolderEvent.bind(this));
            // $(this.s.parentFolderButton).on("click", this.parentFolderEvent.bind(this));
        },

        createRequest: function(action, uri, meta)
        {
            var request = {
                connectionType: StorageManager.currentConnectionType,
                action: action,
                uri: uri,
                meta: meta
            }
            return request;
        },

        actionButtonPressed: function(e)
        {
            //TODO
            if(typeof this.s.defaultActions[e] !== typeof undefined)
            {
                this.s.defaultActions[e].bind(this)();
                return;
            }
            uri = this.currentlySelected.storageItem.uri;
            var request = this.createRequest(e, uri, {});
            this.sendRequest(request);
        },

        parentActionButtonPressed: function(action)
        {
            OptionMenuManager.closeMenu($(".option_menu_button"), optionMenuDom);
            if(typeof this.s.customActionFunctions[action] !== typeof undefined)
            {
                this.s.customActionFunctions[action].bind(this)();
                return;
            }
            var request = this.createRequest(action, this.currentURI, {});
            this.sendRequest(request);
        },

        sendRequest: function(r)
        {
            r.connectionType = StorageManager.currentConnectionType;
            //Sending request
            //ajax stuff
            //success: this.receiveResponse.bind(this)
            //datatype json all the way
            this.send(globalConfig["getResponseURL"], {
                request: JSON.stringify(r)
            });
        },

        receiveResponse: function(response)
        {
            console.log(response);
            this.sendingRequest = false;
            if(typeof response === typeof undefined || response == null || response.length == 0)
            {
                this.requestErrorMessage({
                    errorMsg: "The Server did not respond as expected.\n\nPlease (if possible) save all changes and reload the page to assure proper further behaviour.\n\nWe apologize for any inconveniences."
                });
                return;
            }
            switch(response.type)
            {
                case 0:
                    this.requestFolderUpdate(response.response);
                    break;
                case 1:
                    this.requestFileLoading(response.response);
                    break;
                case 2:
                    this.requestErrorMessage(response.response);
                    break;
            }
        },

        addParentActionButton: function(action)
        {
            var btn = $("<li></li>");
            var i = $("<i></i>", {class: "material-icons dropdown_icon"}).html(this.getActionIcon(action));
            btn.append(i);
            btn.append(" " + this.getActionName(action));
            $(this.s.parentActionContainerIdentifier).append(btn);
            btn.on("click", (function(){
                this.parentActionButtonPressed.bind(this)(action);
            }).bind(this));
        },

        requestFolderUpdate: function(response)
        {
            //open view
            this.currentlySelected = undefined;
            this.updateActions();
            $(this.s.storageViewIdentifier).addClass("active");
            this.currentURI = response.currentURI;
            $.each(this.parentActionButtons, function(){$(this).remove()});
            $(this.s.parentActionContainerIdentifier).html("");
            for(var i = 0;i < response.actions.length; ++i)
            {
                var cAction = response.actions[i];
                this.addParentActionButton(cAction);
            }

            $(this.s.storageContainer).html("");
            for(var i = 0;i < response.storageItems.length; ++i)
            {
                var cStorageItem = response.storageItems[i];
                $.each(this.s.defaultActions, function(key, value){
                    cStorageItem.rights.push(key);
                });
                var guiItem = new StorageGUIItem();
                guiItem.init(cStorageItem);
                guiItem.onSelectListener = this.itemSelected.bind(this);
                guiItem.onDeselectListener = this.itemDeselected.bind(this);
                guiItem.actionListener = this.actionButtonPressed.bind(this);
                $(this.s.storageContainer).append(guiItem.dom);
            }

            var breadCrumbList = $(this.s.breadCrumpIdentifier);
            breadCrumbList.html("");
            breadCrumbItem = this.breadCrumbItem;
            breadCrumbList.append(this.rootBreadCrumbItem());
            $.each(response.hierarchy, function(){breadCrumbList.append(breadCrumbItem(this));});
        },

        rootBreadCrumbItem: function()
        {
            return $("<i></i>", {class: "material-icons"}).html("cloud_queue");
        },

        breadCrumbItem: function(s)
        {
            var dom = $("<li></li>", {class: "breadcrumb_item"});
            dom.html(s);
            return dom;
        },

        canOpenFile: function(ext)
        {
            return (typeof this.s.openFunctions[ext] !== typeof undefined);
        },

        openFile: function(response)
        {
            this.s.openFunctions[response.extension](response);
        },

        downloadFile: function(response)
        {
            var url = globalConfig["currentDomain"] + globalConfig["downloadTempFileURL"] + "/" + response.tempPath;
            window.open(url);
            console.log("Downloading file from url " + url);
        },

        requestFileLoading: function(response)
        {
            var ext = response.extension;
            console.log("The extension: " + response);
            if(this.canOpenFile(ext))
            {
                this.openFile(response);
                return;
            }

            this.downloadFile(response);
        },

        requestErrorMessage: function(response)
        {
            var errorMessage = response.errorMsg;
            ErrorHandler.error(errorMessage, true);
        },
        
        itemDeselected: function(theStorageItem)
        {
            this.currentlySelected.setSelected(false);
            this.currentlySelected = undefined;
            this.updateActions();
        },

        itemSelected: function(theStorageGUIItem)
        {
            if(typeof this.currentlySelected !== typeof undefined)
            {
                this.currentlySelected.setSelected(false);
            }
            this.currentlySelected = theStorageGUIItem;
            this.currentlySelected.setSelected(true);
            this.updateActions();
        },

        updateActions: function()
        {
            if(typeof this.currentlySelected === typeof undefined)
            {
                this.actionView.deactivateAll();
                return;
            }
            this.actionView.activate(this.currentlySelected.storageItem.rights);
        }
    }
})();

module.exports = StorageManager;
