require("./inc/jquery/jquery.js")
require("./ServiceManager.js")

$.widget("workflow.selectionNode", {
    options: {
        nodeClass: "node selection_node",
        serviceListContainerClass: "service_list_container",
        serviceListContainer: undefined,
        onServiceSelected: function(){},
        position: undefined
    },

    _create: function()
    {
        this.element.addClass(this.options.nodeClass);
        
        this.options.serviceListContainer = $("<ul></ul>", {class: this.options.serviceListContainerClass});
        this.element.append(this.options.serviceListContainer);

        for(var key in LocalServiceStorage.availableServices)
        {
            var c = LocalServiceStorage.availableServices[key];
            var dom = this.createListItem(c);
            this.options.serviceListContainer.append(dom);
        }
    },

    moveToMouse: function(event)
    {
        var offset = this.element.parent().offset();
        x = event.pageX- offset.left;
        y = event.pageY- offset.top;
        this.element.css({position: "absolute", left: x, top: y});
        this.options.position = {x: x, y: y};
    },

    createListItem: function(service)
    {
        var d = $("<li></li>");
        d.html("<b>" + service.name + "</b> (v" + service.version + ")");
        d.on("click", (function(){
            this.options.onServiceSelected(service, this.element);
        }).bind(this));
        return d;
    }
});

$.widget("workflow.port", {
    options: {
        node: undefined,
        id: -1,
        name: undefined,
        type: "in",
        class: "port"
    },

    _create: function()
    {
        this.element.html(this.options.name);
        this.element.addClass(this.options.type);
        this.element.addClass(this.options.class);
        this.element.attr("id", "node_" + this.options.node.options.node.id + "_" + this.options.type + "port_" + this.options.name);
    }
});

$.widget("workflow.node", {
    options: {
        node : {},
        wfGUI: undefined,
        titleNode: undefined,
        titleNodeClass: "node_title",
        representedService: undefined,
        portContainer: undefined,
        portContainerClass: "port_container",
        inputPortContainer: undefined,
        inputPortContainerClass: "input_ports",
        outputPortContainer: undefined,
        outputPortContainerClass: "output_ports",
        inputPortDoms: [],
        inputPortClass: "port input_port",
        outputPortDoms: [],
        outputPortClass: "port output_port",
        jsPlumbId: -1
    },

    _create: function()
    {
        this.options.inputPortDoms = [];
        this.options.outputPortDoms = [];
        this.element.addClass("node");
        this.element.attr("id", "node_" + this.options.node.id);
        this._findRepresentedService();
        this.options.titleNode = $("<div></div>", {class: this.options.titleNodeClass}).html(this.options.representedService.name + " v" + this.options.representedService.version + " (" + this.options.representedService.id + ")");
        this.element.append(this.options.titleNode);
        this.options.portContainer = $("<div></div>", {class: this.options.portContainerClass});
        this.options.inputPortContainer = $("<div></div>", {class: this.options.inputPortContainerClass});
        
        for(var i = 0;i < this.options.representedService.inputPorts.length; ++i)
        {
            var port = $("<div></div>").port({
                node: this, //TODO: This is transferred but it should be this.element!
                id: i,
                name: this.options.representedService.inputPorts[i],
                type: "in"
            });
            this.options.inputPortContainer.append(port);
            this.options.inputPortDoms.push(port);
            console.log("Checking input " + i + " ... connection here is " + this.options.node.connections[i]);
        }
        this.options.portContainer.append(this.options.inputPortContainer);

        this.options.outputPortContainer = $("<div></div>", {class: this.options.outputPortContainerClass});
        for(var i = 0;i < this.options.representedService.outputPorts.length; ++i)
        {
            var port = $("<div></div>").port({
                node: this,
                id: i,
                name: this.options.representedService.outputPorts[i],
                type: "out"
            });
            this.options.outputPortContainer.append(port);
            this.options.outputPortDoms.push(port);
        }
        this._adaptConnectionNumber();

        this.options.portContainer.append(this.options.outputPortContainer);
        
        this.element.append(this.options.portContainer);

        this.element.on("click", (function(e)
        {
            if($(e.currentTarget).hasClass("noclick"))
            {
                console.log("May not click!");
                $(e.currentTarget).removeClass('noclick');
                return;
            }
            console.log("clicking");
            this._showParameterView();
            e.stopPropagation();
        }).bind(this));

        if(typeof this.options.node.parameters === typeof undefined)
        {
            this.options.node.parameters = [];
        }
        if(this.options.node.parameters.length != this.options.representedService.params.length)
        {
            //It was not set before, something went wrong. We dare to write it all again
            for(var i = 0;i < this.options.representedService.params.length; ++i)
            {
                this.options.node.parameters[i] = null;
            }
        }
    },

    _adaptConnectionNumber: function()
    {
        for(var i = 0;i < this.options.representedService.inputPorts.length; ++i)
        {
            if(typeof this.options.node.connections[i] === typeof undefined)
            {
                this.options.node.connections[i] = null;
            }
        }
    },

    _showParameterView: function()
    {
        parameterView.parameterWidget("load", this.options.representedService.params, this.options.node.parameters);
    },

    _findRepresentedService: function()
    {
        this.options.representedService = LocalServiceStorage.availableServices[this.options.node.service.id];
        if(typeof this.options.representedService === typeof undefined)
        {
            ErrorHandler.error("This worklow contains non-available services.\nCouldn't open this workflow.", true);
        }
        if(this.options.representedService.version != this.options.node.service.version)
        {
            //TODO: Think about what happens in that case
            ErrorHandler.error("Some services are of an <b>old version</b>.\nIt could happen that the workflow doesn't work as expected.\n");
        }
    },

    _setOption: function( key, value ) {
        this.options[ key ] = value;
        this._update();
    },

    _update: function()
    {
        this.element.css({
            position: "absolute",
            left: this.options.position.x,
            top: this.options.position.y
        });
    },

    notifyDeletion: function(deleteAllConnectionsForPortsFunction)
    {
        JSPlumbWorkflowAPI.detachAllConnections(this.element);
    }
});

var WorkflowGUIHandler = function()
{
    var s;
    var dom;
    var dag;
    var nodes;
    var currentFile;
    var currentURI;
    var overwriteAction;
    var ignoreConnectionEvent = false;
    var readOnly = false;
    return {
        settings: {
            identifierForTogglableItem: ".workflow_view",
            deleteIdentifier: ".remove_service",
            sendIdentifier: ".send_workflow",
            saveIdentifier: ".workflow_action_buttons .save",
            workflowTitleIdentifier: ".workflow_file_title"
        },

        init: function(theDom, file = undefined, customSettings = {})
        {
            this.s = $.extend( {}, this.settings, customSettings);     
            
            this.dom = theDom;
            this.initUIActions();
        },

        initUIActions: function()
        {
            $(".collapse").on("click", this.hide.bind(this));
            this.dom.on("dblclick", this.serviceAddingRequest.bind(this));
            this.dom.bind("contextmenu", this.serviceAddingRequest.bind(this));
            this.dom.on("click", this.removeAllSelectionNodes.bind(this));
            $(this.s.sendIdentifier).on("click", this.onSendRequest.bind(this));
            $(this.s.saveIdentifier).on("click", this.save.bind(this));
        },

        save: function()
        {
            var req = StorageManager.createRequest(this.overwriteAction, this.currentURI, [
                {
                    "key": "content",
                    "value": this.serializeDAG(this.dag)
                }
            ]);
            StorageManager.sendRequest(req);
        },

        serializeDAG: function(realDag)
        {
            //TODO This is ugly... maybe think about this being automatically be done.
            //The parameter widget was created for a different kind of structure so we have to convert it...
            //I don't like how it is right now
            var dag = jQuery.extend(true, {}, realDag);
            
            dag.user = window.username;
            return JSON.stringify(dag);
        },

        onSendRequest: function()
        {
            if(this.nodes.length <= 0)
            {
                ErrorHandler.error("This workflow is empty. Why would you want to send an empty workflow?", false, "Empty Workflow");
                return;
            }
            var serializedDAG = this.serializeDAG(this.dag);
            console.log(serializedDAG);
            $.ajax({
                url: globalConfig["sendWorkflowURL"],
                method: "POST",
                data: {
                    workflow: serializedDAG
                },
                success: this.onWorkflowSent.bind(this)
            });
        },

        onWorkflowSent: function()
        {
            //TODO: Open queue view
            MainMenuHandler.changeToTab(1);
            QueueManager.updateQueue();
        },

        removeAllSelectionNodes: function()
        {
            this.dom.find(".selection_node").remove();
            parameterView.parameterWidget("close");
        },

        serviceAddingRequest: function(event)
        {
            this.removeAllSelectionNodes();
            var selectionNode = $("<div></div>");
            this.dom.append(selectionNode);
            selectionNode.selectionNode({
                onServiceSelected: this.onServiceSelected.bind(this)
            });
            selectionNode.selectionNode("moveToMouse", event);
            return false;
        },

        loadFile: function(response)
        {
            //a new workflow should be loaded
            this.currentFile = response.tempPath;
            this.overwriteAction = response.overwriteAction;
            this.currentURI = response.uri;

            this.readOnly = (typeof this.overwriteAction === typeof undefined || this.overwriteAction == null || this.overwriteAction.length == 0);
            
            if(this.readOnly)
            {
                $(this.s.saveIdentifier).css({display: "none"});
            }

            if(typeof this.currentFile === typeof undefined)
            {
                this.hide();
                return;
            }

            this.show();
            var workflowLoader = new WorkflowLoader();
            workflowLoader.load(this.currentFile, this.loadWorkflow.bind(this));
        },

        hide: function()
        {
            parameterView.parameterWidget("close");            
            $(this.s.identifierForTogglableItem).removeClass("visible");
        },

        show: function()
        {
            $(this.s.identifierForTogglableItem).addClass("visible");
        },

        connectionDetachedEvent: function(info, originalEvent)
        {
            var sourceEl = info.source;
            var targetEl = info.target;

            var sourceDom = $(sourceEl);
            var targetDom = $(targetEl);

            var nodeId = targetDom.port("option", "node").options.node.id;
            var portId = targetDom.port("option", "id");

            var nodeElement;
            for(var i = 0; i < this.nodes.length; ++i)
            {
                if(this.nodes[i].id == nodeId)
                {
                    nodeElement = this.nodes[i];
                    break;
                }
            }

            nodeElement.connections[portId] = null;
        },

        connectionEvent: function(info, originalEvent)
        {
            if(this.ignoreConnectionEvent === true)
            {
                return;
            }

            var sourceEl = info.source;
            var targetEl = info.target;

            var sourceDom = $(sourceEl);
            var targetDom = $(targetEl);

            var nodeId = targetDom.port("option", "node").options.node.id;
            var portId = targetDom.port("option", "id");

            var nodeElement;
            for(var i = 0; i < this.nodes.length; ++i)
            {
                if(this.nodes[i].id == nodeId)
                {
                    nodeElement = this.nodes[i];
                    break;
                }
            }

            nodeElement.connections[portId] = {
                port_idx: sourceDom.port("option", "id"),
                node_id: sourceDom.port("option", "node").options.node.id
            }
        },

        loadWorkflow: function(workflow)
        {
            this.dom.html("");
            JSPlumbWorkflowAPI.init({
                connectionDetachedEvent: this.connectionDetachedEvent.bind(this),
                connectionEvent: this.connectionEvent.bind(this)
            });
            //We will only have one workflow for now
            JSPlumbWorkflowAPI.startMassLoading();
            this.dag = workflow[0];
            $(this.s.workflowTitleIdentifier).html(this.dag.name);
            this.nodes = this.dag.nodes;
            
            for(var i = 0;i < this.nodes.length; ++i)
            {
                this.initializeNode(this.nodes[i], {
                    x: i*300 + 100,
                    y: 500
                });
            }

            this.ignoreConnectionEvent = true;
            for(var i = 0;i < this.nodes.length; ++i)
            {
                this.initializeConnections(this.nodes[i].id, this.nodes[i].connections);
            }
            this.ignoreConnectionEvent = false;

            JSPlumbWorkflowAPI.endMassLoading();
        },

        initializeConnections: function(toNode, connections)
        {
            JSPlumbWorkflowAPI.initConnections(toNode, connections);
        },

        initializeNode: function(theNode, thePosition)
        {
            var node = $("<div></div>");
            this.dom.append(node);
            node.node(
                {
                    node: theNode,
                    wfGUI: this,
                    position: thePosition
                }
            );

            //The js plumb id will now be needed to properly use the JSPlumbWorkflowAPI
            node.node("option", "jsPlumbId", JSPlumbWorkflowAPI.addNode(node, this.onDrag.bind(this), this.onStopDrag.bind(this)));
        },

        onDrag: function(e)
        {
            $(e.drag.el).addClass("noclick");

            $(this.s.deleteIdentifier).addClass("active");
        },

        onStopDrag: function(e)
        {
            //after the onStopDrag event the click event will be fired. It should not be used once. So then the class onclick will be removed.
            $(e.drag.el).addClass("noclick");

            if($(this.s.deleteIdentifier).is(":hover"))
            {
                var dom = $(e.el);
                this.deleteNode(dom);
            }
            
            $(this.s.deleteIdentifier).removeClass("active");
        },

        deleteNode: function(dom)
        {
                var node = dom.node("option", "node");
                dom.node("notifyDeletion");

                var id = node.id;
                for(var i = 0;i < this.nodes.length; ++i)
                {
                    if(this.nodes[i].id == id)
                    {
                        this.nodes.splice(i, 1);
                    }
                }
                
                dom.remove();
        },

        onServiceSelected: function(service, selectionNode)
        {
            var cService = {
                id: service.id,
                version: service.version
            }
            var newId = service.id + "_" + this.dag.nodes.length;
            var node = {
                "id":newId,
                "service":cService,
                "connections":[],
                "parameters":[]
            }

            this.dag.nodes.push(node);

            this.initializeNode(node, selectionNode.selectionNode("option", "position"));
            selectionNode.remove();
            JSPlumbWorkflowAPI.repaint();
        }
    }
}

//TODO: Put in another file!
var WorkflowLoader = function() {
    var onLoadMethod;
    return {
        load: function(file, theOnLoadMethod)
        {
            //ajax magic
            this.onLoadMethod = theOnLoadMethod;
            $.ajax({
                url: globalConfig["downloadTempFileURL"] + "/" + file,
                success: this.onResponse.bind(this)
            });
        },

        onResponse: function(response)
        {
            var dag = JSON.parse(response);

            this.onLoadMethod([dag]);
        }
    }
}

module.exports = WorkflowGUIHandler;
