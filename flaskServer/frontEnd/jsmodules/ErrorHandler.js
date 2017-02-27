var ErrorHandler = (function(){
    return {
        error: function(errorMsg, showReloadButton, title)
        {
            var div = $("<div></div>", {class: "full_error_container"});
            if(typeof showReloadButton === typeof undefined)
            {
                showReloadButton = false;
            }
            if(typeof title === typeof undefined)
            {
                title = "We are very sorry...";
            }
            var errorContainer = $("<div></div>", {class: "error_container"});
            var h1 = $("<h1></h1>", {class: "error_title"}).html(title);
            var msg = $("<div></div>", {class: "error"}).html(errorMsg.split("\n").join("<br>"));
            errorContainer.append(h1);
            errorContainer.append(msg);
            div.append(errorContainer);

            var errorButtons = $("<div></div>", {class: "error_buttons"});

            if(showReloadButton)
            {
                var reloadButton = $("<input></input>", {class: "default_button reload_button", value: "Reload", type: "submit"});
                reloadButton.on("click", function(e){
                    e.stopPropagation();
                    location.reload();
                });
                errorButtons.append(reloadButton);
            }
            var okayButton = $("<input></input>", {class: "default_button okay_button", value: "Okay", type: "submit"});
            okayButton.on("click", function(e){
                e.stopPropagation();
                PopUpManager.close();
            });
            errorButtons.append(okayButton);

            div.append(errorContainer);
            div.append(errorButtons);
            PopUpManager.show(div);
        }
    }
})();

module.exports = ErrorHandler;