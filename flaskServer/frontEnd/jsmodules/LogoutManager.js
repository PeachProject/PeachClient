var LogoutManager = (function(){
    return {
        logout: function(){
            $.ajax({
                url: globalConfig["logoutURL"],
                success: function()
                {
                    location.reload(); 
                }
            })
        }
    }
})();

module.exports = LogoutManager;