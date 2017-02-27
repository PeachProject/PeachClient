##########################################
##########################################
###### MANDATORY CONFIG SETTINGS #########
##########################################
##########################################

schema_folder = "<PeachClient_Git_Repo>/PeachShared/schemas"

temp_locations = {
    "workflow_temp": "<peach_temp_data>/workflow_temp",
    "download_workflow_temp": "<peach_temp_data>/download_temp/workflows",
    "download_files_temp": "<peach_temp_data>/download_temp/files"
}

mysql_info = {
    "host": "<mysql_host>",
    "user": "<mysql_user>",
    "password": "<mysql_pw>",
    "database": "<mysq_database>"
}


frontendConfiguration = {
        #maybe you will have to change the current domain
        "currentDomain": "<current_domain>",


        "ldapLoginURL": "/ldap/checkCredentials",
        "logoutURL": "/ldap/logout",
        "serviceURL": "/serviceAgent/retrieve",
        "sendWorkflowURL": "/workflow/send",
        "getResponseURL": "/storage/getResponse",
        "getInitialResponseURL": "/storage/getInitialResponse",
        "getInitialRequestURL": "/storage/getInitialRequest",
        "getQueueURL" : "/workflow/receive",
        "removeQueueItemURL" : "/workflow/remove",
        "downloadTempFileURL": "/storage/download"
    }

##########################################
##########################################
###### Secondary CONFIG SETTINGS #########
##########################################
##########################################

storage_modules = [
    "library.xnatAgent.xnatQuery"
]

method_names = {
    "response": "get_response",
    "initialRequest": "get_initial_request"
}

##########################################
##########################################
####### Don't change this part! ##########
##########################################
##########################################



def get_schema_folder():
    return schema_folder

def get_frontend_configuration():
    return frontendConfiguration
    
def get_private_session_key():
    return "3(BQJ_W5h-32t0C/Uw[G*3j373-Cbl"
    
def get_default_method_name(key):
    return method_names[key]

def get_storage_module(connection_type):
    return storage_modules[connection_type]

def get_mysql_info():
    return mysql_info

def get_temp_location(temp_role):
    return temp_locations[temp_role]
