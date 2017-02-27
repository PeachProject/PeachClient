global.LoadingManager = require("../jsmodules/loadingManager.js");
global.VisualAjaxRequest = require("../jsmodules/VisualAjaxRequest.js")
global.LDAPLoginManager = require("../jsmodules/ldapLoginScript.js")

LoadingManager.init();
VisualAjaxRequest.init();
LDAPLoginManager.init();