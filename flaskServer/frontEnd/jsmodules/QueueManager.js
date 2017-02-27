require("./GenericMenu.js")

var QueueManager = (function(){
    var s;
    var queueItems;
    var menuItems = [];
    var queuedMenu;
    var archivedMenu;
    var queuedActionView;
    var archivedActionView;
    return {
        settings: 
        {
            queuedActionViewIdentifier: ".running_view",
            archivedActionViewIdentifier: ".archive_view",
            queuedContentIdentifier: ".running_content",
            achivedContentIdentifier: ".archive_content",
            progressColor: "#27ae60",
            statusNames: [
                "Queued",
                "Processing",
                "Cancelled",
                "Success",
                "Error"
            ],
            valuesToDisplay: [
                {
                    "original_workflow_file": "Workflow-File",
                    "sending_date": "Sending Date",
                    "priority": "Priority",
                    "status": "Status"
                },
                {
                    "original_workflow_file": "Workflow-File",
                    "sending_date": "Sending Date",
                    "priority": "Priority",
                    "status": "Status"
                },
                {
                    "original_workflow_file": "Workflow-File",
                    "sending_date": "Sending Date",
                    "priority": "Priority",
                    "status": "Status"
                },
                {
                    "original_workflow_file": "Workflow-File",
                    "sending_date": "Sending Date",
                    "priority": "Priority",
                    "status": "Status",
                    "output_file": "Download output"
                },
                {
                    "original_workflow_file": "Workflow-File",
                    "sending_date": "Sending Date",
                    "priority": "Priority",
                    "status": "Status"
                }
            ],
            stateClassPrefix: "state_",
            syncButtonIdentifier: ".sync_button",
            rotationClass: "buttonRotation"
        },

        init: function(customSettings)
        {
            this.s = $.extend( {}, this.settings, customSettings);
            var genericMenuOptions = {
                menuItems: [],
                menuItemCreator: this.createMenuItem.bind(this),
                currentItemClass: "active",
                currentElement: -1,
                defaultEvent: "click",
                deselectOnReselect: true,
                ignoreReselect: false
            };
            var queuedMenuOptions = genericMenuOptions;
            var archivedMenuOptions = genericMenuOptions;
            this.queuedMenu = $(this.s.queuedContentIdentifier).genericMenu(queuedMenuOptions);
            this.archivedMenu = $(this.s.achivedContentIdentifier).genericMenu(queuedMenuOptions);
            
            this.queuedActionView = ActionView();
            this.queuedActionView.init({
                "identifier": this.s.queuedActionViewIdentifier,
                "actionButtonIdentifier": ".running_action_buttons li"
            });
            this.queuedActionView.setEvents({
                "delete": this.deleteEventQueued.bind(this)
            });
            this.archivedActionView = ActionView();
            this.archivedActionView.init({
                "identifier": this.s.archivedActionViewIdentifier,
                "actionButtonIdentifier": ".archive_action_buttons li"
            });
            this.archivedActionView.setEvents({
                "delete": this.deleteEventArchived.bind(this)
            });
            this.updateQueue();
            this.bindUIActions();
        },

        deleteEventQueued: function()
        {
            //delete and update TODO: delete
            var currentElement = this.queuedMenu.genericMenu("option", "currentElement");
            var menuItems = this.queuedMenu.genericMenu("option", "menuItems");
            var menuItem = menuItems[currentElement]
            var queueItem = menuItem.queueItem;
            var index = queueItem.id;
            this.queuedActionView.deactivateAll();            
            this.deleteAnimation(menuItem.dom, (function(){
                this.deleteQueueItem(index);
            }).bind(this));
              
        },

        deleteEventArchived: function()
        {
            var currentElement = this.archivedMenu.genericMenu("option", "currentElement");
            var menuItems = this.archivedMenu.genericMenu("option", "menuItems");
            var menuItem = menuItems[currentElement]
            var queueItem = menuItem.queueItem;
            var index = queueItem.id;
            this.archivedActionView.deactivateAll();
            this.deleteAnimation(menuItem.dom, (function(){
                this.deleteQueueItem(index);
            }).bind(this));
        },

        deleteQueueItem: function(id)
        {
            $.ajax({
                url: globalConfig["removeQueueItemURL"],
                data: {
                    id: id
                },
                type: "POST",
                success: this.updateQueue.bind(this)
            });
        },

        bindUIActions: function()
        {
            var updateFunction = this.updateQueue.bind(this);
            var s = this.s;
            $(this.s.syncButtonIdentifier).on("click", function(e)
            {
                $(this).addClass(s.rotationClass).one("webkitAnimationEnd mozAnimationEnd oAnimationEnd msAnimationEnd animationend", function(){
                    $(this).removeClass(s.rotationClass);
                });
                updateFunction();
            });
        },

        createMenuItem: function(menuItem)
        {
            var main = $("<li></li>", {class: "queue_item"});
            var titleBar = $("<div></div>", {class: "queue_title_bar"});
            var queueName = $("<div></div>", {class: "queue_name"}).html(
                "<b>" + menuItem.queueItem.original_workflow_file + "</b> (" + menuItem.queueItem.id + ")" 
            );
            var queueProgress = $("<div></div>", {class:  "queue_progress"})
            if(menuItem.queueItem.status < 2)
            {
                queueProgress.html(menuItem.queueItem.progress + "%").css({"background": "linear-gradient(90deg, " + this.s.progressColor + " " + menuItem.queueItem.progress + "%, transparent " + menuItem.queueItem.progress + "%)"});
            }else
            {
                queueProgress.addClass(this.s.stateClassPrefix + menuItem.queueItem.status);
                queueProgress.html(this.s.statusNames[menuItem.queueItem.status]);
            }
            titleBar.append(queueName);
            titleBar.append(queueProgress);

            var queueMetaData = $("<div></div>", {class: "queue_meta_data"});
            for(var key in this.s.valuesToDisplay[menuItem.queueItem.status])
            {
                var line = $("<div></div>", {class: "queue_meta_line"});
                var keyDom = $("<div></div>", {class: "queue_key"}).html(this.s.valuesToDisplay[menuItem.queueItem.status][key]);
                var valueDom = $("<div></div>", {class: "queue_value"}).html(menuItem.queueItem[key]);
                if(key == "status")
                {
                    valueDom.html(this.s.statusNames[menuItem.queueItem[key]]);
                }else if(key == "output_file")
                {
                    valueDom.html("<a href='" + globalConfig["currentDomain"] + globalConfig["downloadTempFileURL"] + "/" + menuItem.queueItem[key] + "' target='_blank'>Download here</a>");
                }
                line.append(keyDom);
                line.append(valueDom);
                queueMetaData.append(line);
            }
            main.append(titleBar);
            main.append(queueMetaData);
            return main;
        },

        deleteAnimation: function(div, onFinished)
        {
            div.css({"margin-left": (div.width() * (-1))});
            setTimeout(onFinished, 300);
        },

        updateQueue: function()
        {
            //TODO: Ajax stuff for queue updating
            $.ajax(
                {
                    url: globalConfig["getQueueURL"],
                    type: "POST",
                    dataType: "json",
                    success: this.onResponse.bind(this)
                }
            );
        },


        onResponse: function(response)
        {
            //TODO: Do something with json response
            this.queueItems = response;
            this.updateDisplay();
        },

        updateDisplay: function()
        {
            
            //Save previous selected
            /*var runningSelected = this.getQueueItemWithId(this.queuedMenu.genericMenu("option", "currentElement"));
            var runningSelectedId = -1;
            if(runningSelected !== undefined) runningSelectedId = runningSelected.id;

            var archiveSelected = this.getQueueItemWithId(this.archivedMenu.genericMenu("option", "currentElement"));
            var archiveSelectedId = -1;            
            if(archiveSelected !== undefined) archiveSelectedId = archiveSelected.id;*/

            //Generate all ids that were contained previously
            var menuItems = [[],[]];

            var newQueuedSelected = -1;
            var newArchivedSelected = -1;
            this.queuedMenu.genericMenu("option", "currentElement", -1);
            this.archivedMenu.genericMenu("option", "currentElement", -1);
            for(var i = 0;i < this.queueItems.length; ++i)
            {
                var menu;
                if(this.queueItems[i].status < 2)
                {
                    menu = 0;
                }else
                {
                    menu = 1;
                }

                var menuItem = {
                    queueItem: this.queueItems[i],
                    onSelect: function(){ 
                        this.actionView.activate(["delete"]);
                    },
                    onDeselect: function(){ 
                        this.actionView.deactivateAll();
                    }
                };
                menuItems[menu].push(menuItem);
                if(menuItem.queueItem.status < 2)
                {
                    menuItem.actionView = this.queuedActionView;
                }else
                {
                    menuItem.actionView = this.archivedActionView;
                }
                /*if(this.queueItems[i].id == runningSelectedId)
                {
                    newQueuedSelected = menuItems[menu].length - 1;
                }else if(this.queueItems[i].id == archiveSelectedId)
                {
                    newArchivedSelected = menuItems[menu].length - 1;
                }*/
            }
            this.queuedMenu.genericMenu("option", "menuItems", menuItems[0]);
            this.archivedMenu.genericMenu("option", "menuItems", menuItems[1]);
        },

        getQueueItemWithId: function(id)
        {
            for(var i = 0;i < this.queueItems.length; ++i)
            {
                if(this.queueItems[i].id == id) return this.queueItems[i];
            }
            return undefined;
        }
    }
})();

module.exports = QueueManager;