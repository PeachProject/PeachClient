

var TextFileEditor = (function(){
    return {
        settings: {
            saveIdentifier: ".text_save",
            identifier: ".text_editor_view",
            titleIdentifier: ".text_editor_title",
            contentIdentifier: ".text_editor_content",
            closeIdentifier: ".text_close",
            visibleClass: "visible",
            extensionAssign: {
                py: "ace/mode/python",
                js: "ace/mode/javascript",
                html: "ace/mode/html",
                txt: "ace/mode/text",
                json: "ace/mode/json",
                m: "ace/mode/matlab",
                tex: "ace/mode/latex",
                h: "ace/mode/c_cpp",
                cpp: "ace/mode/c_cpp",
                c: "ace/mode/c_cpp"
            }
        },
        init: function(customSettings)
        {
            this.s = $.extend( {}, this.settings, customSettings);     
            this.contentDom = $(this.s.contentIdentifier);
            this.bindUIActions();
        },
        bindUIActions: function()
        {
            $(this.s.closeIdentifier).on("click", this.hide.bind(this));
            $(this.s.saveIdentifier).on("click", this.save.bind(this));
        },
        save: function()
        {
            var req = StorageManager.createRequest(this.overwriteAction, this.currentURI, [
                {
                    "key": "content",
                    "value": this.editor.getValue()
                }
            ]);
            StorageManager.sendRequest(req);
        },
        loadFile: function(response)
        {
            this.currentFile = response.tempPath;
            this.overwriteAction = response.overwriteAction;
            this.currentURI = response.uri;
            this.extension = response.extension;
            this.readOnly = (typeof this.overwriteAction === typeof undefined || this.overwriteAction == null || this.overwriteAction.length == 0);

            if(this.readOnly)
            {
                $(this.s.saveIdentifier).css({display: "none"});
            }else
            {
                $(this.s.saveIdentifier).css({display: "inherit"});
            }

            if(typeof this.currentFile === typeof undefined)
            {
                this.hide();
                return;
            }

            
            var textFileLoader = new TextFileLoader();
            textFileLoader.load(this.currentFile, this.loadTextFile.bind(this));
        },
        show: function()
        {
            $(this.s.identifier).addClass(this.s.visibleClass);
        },
        hide: function()
        {
            $(this.s.identifier).off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
            $(this.s.identifier).removeClass(this.s.visibleClass);
        },
        loadTextFile: function(content)
        {
            //...
            this.show();
            $(this.s.titleIdentifier).html(this.currentURI);
            this.contentDom.css({"font-size": "16px", "letter-spacing": "0"});
            this.editor = ace.edit(this.contentDom.get(0));
            this.editor.setTheme("ace/theme/ambiance");
            this.editor.getSession().setMode(this.s.extensionAssign[this.extension]);
            this.editor.setValue(content);
            $(this.s.identifier).on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", (function(){
                console.log("resizing...");
                this.editor.resize(true);}).bind(this));
        }
    }
})();

//TODO: Put in another file!
var TextFileLoader = function() {
    var onLoadMethod;
    return {
        load: function(file, theOnLoadMethod)
        {
            //ajax magic
            $.ajax({
                url: globalConfig["downloadTempFileURL"] + "/" + file,
                success: theOnLoadMethod
            });
        },
    }
}

module.exports = TextFileEditor;