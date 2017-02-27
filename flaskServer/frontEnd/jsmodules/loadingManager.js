require("./inc/jquery/jquery.js")

var LoadingManager = (function(){
    var s;
    var loadingRequests = 0;
    return {
        settings: {
            loadingIdentifier: "#loading"
        },
        
        init: function(customSettings = {})
        {
            LoadingManager.s = $.extend( {}, LoadingManager.settings, customSettings);
        },

        showLoadingAnimation: function()
        {
            LoadingManager.loadingRequests++;
            $(LoadingManager.s.loadingIdentifier).css(
                    {
                        display: "block"
                    }
                );
        },

        hideLoadingAnimation: function()
        {
            LoadingManager.loadingRequests--;
            if(LoadingManager.loadingRequests > 0) return;
            $(LoadingManager.s.loadingIdentifier).css(
                    {
                        display: "none"
                    }
                );
        }
    }
})();

module.exports = LoadingManager;