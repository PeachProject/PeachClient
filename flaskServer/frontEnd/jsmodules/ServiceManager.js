require("./inc/jquery/jquery.js")

var LocalServiceStorage = (function()
{
    var s;
    return {
        settings: {
            url: globalConfig["serviceRetrieveUrl"],
        },

        str2ab: function(str) {
            var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
            var bufView = new Uint16Array(buf);
            for (var i=0, strLen=str.length; i<strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        },

        availableServices: {},

        schemaHasLoaded: false,

        binaryLoaded: false,

        init: function(customSettings = {})
        {
            this.s = $.extend( {}, this.settings, customSettings);  
            this.loadServices();
        },

        loadServices: function()
        {
            //TODO: ajaxMagic
            $.ajax({
                url: globalConfig["serviceURL"],
                dataType: "json",
                processData: false,
                success: this.onResponse.bind(this),
                error: this.onResponse.bind(this) //TODO: Proper error handling
            });
        },

        onResponse: function(response)
        {
            for(var i = 0;i < response.length; ++i)
            {
                var cService = response[i];
                this.availableServices[cService.id] = cService;
            }
        }

    }
})();

module.exports = LocalServiceStorage;