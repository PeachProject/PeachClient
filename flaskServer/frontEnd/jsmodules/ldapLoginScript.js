require("./inc/jquery/jquery.js")

var LDAPLoginManager = (function(){
    var s;
    var ldapLoading = false;
    return {
        /**
         * Contains all the predefined settings and constants
         */
        settings: {
            requestURL: globalConfig["ldapLoginURL"],
            formToSubmit: "#login_form",
            username: "#username",
            password: "#password",
            responseLabel: "#response",
            keep: "#keep_login",
            shakingContainer: ".login_container",
            fadeInContainer: ".login_container",
            errorMessages: {
                "authentication" : "Wrong username or password.",
                "internal": "An internal error has occurred."
            },
            redirectUrl: "dashboard"
        },

        /**
         * This function has to be called to use the module
         */
        init: function(customSettings = {})
        {
            s = this.settings;
            for (name in customSettings) {
                s[name] = customSettings[name];
            }
            this.bindUIActions();
        },

        /**
         * Binds all ui events
         */
        bindUIActions: function()
        {
            $(s.formToSubmit).submit(function(){
                if(ldapLoading) return false;
                ldapLoading = !ldapLoading;
                LDAPLoginManager.checkLogin();
                return false;
            });
        },

        /**
         * Will check the login for the given username and password
         * @param {String} username
         * @param {String} password
         */
        checkLogin: function()
        {
            var username, password, keep;
            username = $(s.username).val();
            password = $(s.password).val(),
            keep = $(s.keep).is(':checked');

            

            $.ajax({
                method: "GET",
                url: s.requestURL,
                data: {
                    username: username,
                    password: password,
                    stay: keep.toString()
                },
                success: LDAPLoginManager.onResponse,
                error: LDAPLoginManager.onError
            });
        },

        /**
         * Will be called when the server sent a response.
         * This function will analyze the response.
         * @param {String} response
         */
        onResponse: function(response)
        {
            ldapLoading = false;
            if(response === "0")
            {
                LDAPLoginManager.login();
            }else if(response === "1")
            {
                LDAPLoginManager.onError("authentication");
            }else
            {
                LDAPLoginManager.onError();
            }
        },

        /**
         * Will be called when an error of any kind was detected.
         * The function will display the stored error message for the given errorCode.
         * @param {String} errorCode
         */
        onError: function(errorCode = "internal")
        {
            ldapLoading = false;
            LDAPLoginManager.writeResponse(s.errorMessages[errorCode]);
            $(s.shakingContainer).effect("shake");
        },

        /**
         * Sends a message to the user.
         * @param {String} response
         */
        writeResponse: function(response)
        {
            $(s.responseLabel).html(response);
        },

        /**
         * Will be called when the login process has taken place successfully in the backend.
         */
        login: function()
        {
            location.href = s.redirectUrl;
        }
    }
})();

module.exports = LDAPLoginManager;