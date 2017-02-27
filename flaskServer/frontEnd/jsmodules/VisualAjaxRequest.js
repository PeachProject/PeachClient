require("./inc/jquery/jquery.js")

/**
 * This module overwrites / wraps the usual ajax function delivered with jQuery to automatically show loading animations.
 * 
 * The default usage of the VisualAjaxRequest module depends on the LoadingManager module and its two main functions called
 *   - showLoadingAnimation
 *   - hideLoadingAnimation
 * 
 * The module will be activated using the init function. Example usage:
 * 
 * VisualAjaxRequest.init();
 * 
 * But you can also overwrite the default functions that will be called. Example usage:
 * 
 * VisualAjaxRequest.init(
 * {
 *      onBeginFunction: function(){
 *          window.blockGUI();
 *      },
 *      
 *      onEndFunction: function(){
 *          window.unblockGUI();
 *      }
 * }
 * );
 */
VisualAjaxRequest = (function(){
    var s;
    return{
        settings:
        {
            onBeginFunction: LoadingManager.showLoadingAnimation,
            onEndFunction: LoadingManager.hideLoadingAnimation
        },
        init: function(customSettings)
        {
            this.s = $.extend( {}, this.settings, customSettings);
            $.ajax = this.fn.ajax;
            $.get = this.fn.get;
            $.post = this.fn.post;
        },
        base:
        {
            ajax: $.ajax,
            get: $.get,
            post: $.post
        },
        fn:
        {
            then: function(data)
            {
                this.s.onEndFunction();
                return $.Deferred().promise(data);
            },
            ajax: function(options)
            {
                VisualAjaxRequest.s.onBeginFunction();
                return VisualAjaxRequest.base.ajax(options).then(VisualAjaxRequest.fn.then.bind(VisualAjaxRequest));
            },
            get: function (options)
            {
                VisualAjaxRequest.s.onBeginFunction();
                return VisualAjaxRequest.base.get(options).then(VisualAjaxRequest.fn.then(VisualAjaxRequest.fn.then.bind(VisualAjaxRequest)));
            },
            post: function (options)
            {
                VisualAjaxRequest.s.onBeginFunction();
                return VisualAjaxRequest.base.post(options).then(VisualAjaxRequest.fn.then(VisualAjaxRequest.fn.then.bind(VisualAjaxRequest)));
            }
        }
    }
})();

module.exports = VisualAjaxRequest;
