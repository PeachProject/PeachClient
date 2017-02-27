require("./inc/jquery/jquery.js")

var JSPlumbWorkflowAPI = (function(){
    var s;
    var workflowDom;
    var instance;
    var nodeElements = [];
    return {
        settings: {
            workflowParentIdentifier: ".workflow_content",
            connectionDetachedEvent: function(){},
            connectionEvent: function(){}
        },

        init: function(customSettings = {})
        {
            this.s = $.extend( {}, this.settings, customSettings);

            instance = jsPlumb.getInstance();
            instance.setContainer($(this.s.workflowParentIdentifier));

            instance.bind('click', function (connection, e) {
                instance.detach(connection);
            });

            instance.bind("connectionDetached", this.s.connectionDetachedEvent);
            instance.bind("connection", this.s.connectionEvent);
        },

        startMassLoading: function()
        {
            instance.setSuspendDrawing(true);
        },

        endMassLoading: function()
        {
            instance.setSuspendDrawing(false, true);
        },

        repaint: function()
        {
            instance.repaintEverything();
        },

        getRemoveOverlayDom: function()
        {
            var overlay = $("<div></div>");
            var content = $("<div></div>", {class: "connector_remove_icon"})
            content.addClass("connector_remove_icon");
            content.html("clear");
            overlay.append(content);
            return overlay;
        },

        generateUuidManually: function(nodeId, portType, portId)
        {
            return nodeId + "." + portType + "." + portId;
        },

        generateUuid: function(port)
        {
            return this.generateUuidManually(port.port("option", "node").options.node.id, port.port("option", "type"), port.port("option", "id"))
        },

        addNode: function(nodeElement, onDrag, onStopDrag)
        {
            nodeElements.push(nodeElement);

            instance.draggable(nodeElement, {
                start: onDrag,
                stop: onStopDrag
            });

            var genericEndpointOptions = {
                connector : "StateMachine",
                connectorStyle: { strokeWidth:3, stroke:'#da5653' },
                scope:"default_connection",
                endpoint: "Dot",
                paintStyle: {radius: 6, fill: "transparent", cssClass: "plug"},
                connectorHoverClass: "connector_hover_class",
                connectorOverlays: [
                    ["PlainArrow", { width:10, length:10, location:1, id:"arrow" }],
                    ["Custom", {
                        create: this.getRemoveOverlayDom,
                        location:0.5,
                        id:"connector_remove_icon"
                    }]
                ],
                dragAllowedWhenFull:true,
                connectionsDetachable: true,
                isTarget:false,
                isTarget:false
            }

            var endpointOptionsInput = {
                anchor:"Left", 
                isTarget:true,
                maxConnections: 1
            };

            var endpointOptionsOutput = {
                anchor:"Right", 
                isSource:true, 
                maxConnections: -1
            };

            for(var i = 0;i < nodeElement.node("option", "inputPortDoms").length; ++i)
            {
                var c = nodeElement.node("option", "inputPortDoms")[i];
                
                endpointOptionsInput.uuid = this.generateUuid(c);
                console.log(endpointOptionsInput.uuid);

                instance.addEndpoint(c.attr("id"), endpointOptionsInput, genericEndpointOptions);
                 
            }

            for(var i = 0;i < nodeElement.node("option", "outputPortDoms").length; ++i)
            {
                var c = nodeElement.node("option", "outputPortDoms")[i];
                
                endpointOptionsOutput.uuid = this.generateUuid(c);
                console.log(endpointOptionsOutput.uuid);
                

                instance.addEndpoint(c.attr("id"), endpointOptionsOutput, genericEndpointOptions);
            }

            return nodeElements.length - 1;
        },

        initConnections: function(toNode, connections)
        {
            if(typeof connections === typeof undefined)
            {
                return;
            }
            for(var i = 0;i < connections.length; ++i)
            {
                this.initConnection(toNode, i, connections[i]);
            }
        },

        initConnection: function(toNode, toPortIdx, connection)
        {
            //connection.port_idx
            //connection.node_id
            if(typeof connection === typeof undefined || connection == null)
            {
                return;
            }
            if(connection.port_idx < 0) return;
            var sourceUuid = this.generateUuidManually(connection.node_id, "out", connection.port_idx);
            var toUuid = this.generateUuidManually(toNode, "in", toPortIdx);
            console.log(sourceUuid + " -> " + toUuid);
            instance.connect({uuids:[
                sourceUuid, 
                toUuid
                ]});
        },

        removeEndpoint: function(nodeId, portType, portId)
        {
            instance.deleteEndpoint(this.generateUuidManually(nodeId, portType, portId));
        },

        detachAllConnections: function(node)
        {
            var nodeId = node.node("option", "node").id;
            var allPorts = node.node("option", "inputPortDoms").concat(node.node("option", "outputPortDoms"));
            for(var i = 0; i < allPorts.length; ++i)
            {
                var currentPortDom = allPorts[i];
                this.removeEndpoint(nodeId, currentPortDom.port("option", "type"), currentPortDom.port("option", "id"));
            }
        }
    }
})();

module.exports = JSPlumbWorkflowAPI;