"use strict";
global.LocalServiceStorage = require("../jsmodules/ServiceManager.js");
global.LoadingManager = require("../jsmodules/loadingManager.js");
global.VisualAjaxRequest = require("../jsmodules/VisualAjaxRequest.js");
global.StorageManager = require("../jsmodules/StorageManager.js");
global.ResponsiveTitleBar = require("../jsmodules/ResponsiveTitleBar.js");
global.OptionMenuManager = require("../jsmodules/OptionMenuManager.js");
global.WorkflowGUIHandler = require("../jsmodules/WorkflowGUIHandler.js");
global.QueueManager = require("../jsmodules/QueueManager.js");
global.MainMenuHandler = require("../jsmodules/MainMenuHandler.js");
global.ActionView = require("../jsmodules/ActionView.js");
global.JSPlumbWorkflowAPI = require("../jsmodules/jsPlumbWorkflowAPI.js");
global.LogoutManager = require("../jsmodules/LogoutManager.js");
global.PopUpManager = require("../jsmodules/PopUpManager.js");
global.ErrorHandler = require("../jsmodules/ErrorHandler.js");
global.ConnectionManager = require("../jsmodules/ConnectionManager.js");
global.StorageSubMenu = require("../jsmodules/StorageSubMenu.js");
global.UploadManager = require("../jsmodules/UploadManager.js");
global.TextFileEditor = require("../jsmodules/TextFileEditor");
require("../jsmodules/ParameterWidget.js");

LoadingManager.init();
VisualAjaxRequest.init();
PopUpManager.init();

LocalServiceStorage.init();
ResponsiveTitleBar.init(); //Using default init will work here
OptionMenuManager.init(); //Using default init will work here
global.globalWorkflow = WorkflowGUIHandler();
global.globalWorkflow.init($(".workflow_content"));
global.parameterView = $(".parameter_view");
global.parameterView.parameterWidget({
    containerDom: $(".parameter_container")
});

QueueManager.init();
StorageManager.init("muessema/test/anotherone/test");
MainMenuHandler.init();

ConnectionManager.init();
StorageSubMenu.init();
UploadManager.init();
TextFileEditor.init();