var ConnectionManager = (function(){
    var s;
    var connections = [];
    return {
        settings: {
            connectionTypes: [
                {
                    name: "xnat",
                    type: 0,
                    connectorView: function()
                    {
                        var form = $("<div></div>", {class: ""});

                        var serverLabel = $("<label></label>", {class: "connection_label default_input"}).html("Server");

                        var serverField = $("<input></input>", {class: "connection_input default_input"}).attr("type", "text").attr("id", "xnat_server").attr("placeholder", "Server");

                        var usernameLabel = $("<label></label>", {class: "connection_label default_input"}).html("Username");

                        var usernameField = $("<input></input>", {class: "connection_input default_input"}).attr("type", "text").attr("id", "xnat_username").attr("placeholder", "Username");

                        var passwordLabel = $("<label></label>", {class: "connection_label default_input"}).html("Password");

                        var passwordField = $("<input></input>", {class: "connection_input default_input"}).attr("type", "password").attr("id", "xnat_password").attr("placeholder", "Password");

                        form.append(serverLabel);

                        form.append(serverField);

                        form.append(usernameLabel);

                        form.append(usernameField);

                        form.append(passwordLabel);

                        form.append(passwordField);


                        return form;
                    },
                    initialRequestBody: function(d)
                    {
                        var serverField = d.find("#xnat_server");
                        var usernameField = d.find("#xnat_username");
                        var passwordField = d.find("#xnat_password");


                        var body = {
                            server: serverField.val(),
                            user: usernameField.val(),
                            password: passwordField.val(),
                            root: "/projects"
                        }

                        return body;
                    },
                    getTitle: function(initialRequestBody)
                    {
                        return initialRequestBody.user + "@" + initialRequestBody.server;
                    }
                },
                {
                    name: "ftp",
                    type: 1,
                    connectorView: function()
                    {
                        //TODO
                    },
                    initialRequestBody: function(d)
                    {
                        //TODO
                    }
                }
            ]
        },
        
        init: function(customSettings)
        {
            this.s = $.extend( {}, this.settings, customSettings);
            this.connections = [];
        },

        getAllConnectionTypes: function()
        {
            return this.s.connectionTypes;
        },

        getConnectionTypeByTypeId: function(id)
        {
            for(var i = 0;i < this.s.connectionTypes.length; ++i)
            {
                if(this.s.connectionTypes[i].type == id)
                    return this.s.connectionTypes[i];
            }
            return undefined;
        },

        addConnection: function(d, type)
        {
            var connectionType = this.getConnectionTypeByTypeId(type);
            var body = connectionType.initialRequestBody(d);
            var title = connectionType.getTitle(body);
            var connection = {
                head: {
                    title: title
                },
                body: {
                    type: type,
                    connectionContent: body
                }
            }
            this.connections.push(connection);
        },

        removeConnection: function(i)
        {
            this.connections.splice(i, 1);
        },

        getConnections: function()
        {
            return this.connections;
        }
    };
})();

module.exports = ConnectionManager;