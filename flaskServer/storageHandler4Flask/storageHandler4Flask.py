from flask import Blueprint
from flask import request
from flask import make_response
import json
import library.storageHandler.storageHandler as storage_handler
from flaskServer.config.flaskServerConfig import get_temp_location
import os

storageHandler4Flask = Blueprint('storageHandler4Flask', __name__)

@storageHandler4Flask.route("/getInitialResponse", methods = ["POST"])
def sendInitialRequest():
    """
    Will return the response for the created initial request. Needed post values are:
      - "connection"
    
    Example usage:
        sendInitialRequest({
            type: 0,
            connectionContent: {
                server: "server",
                user: "user",
                password: "password"
            }
        })
    
    "connectionContent" will be transferred to the specific connector (e.g. XNAT, FTP, GIT)
    """
    
    connection_json = request.form["connection"]
    con = conditionalJSON(connection_json)
    first_request = storage_handler.get_initial_request(con)
    first_response = storage_handler.get_response(first_request)
    print first_response
    first_response_json = json.dumps(first_response)
    return first_response_json

@storageHandler4Flask.route("/getInitialRequest", methods = ["POST"])
def getInitialRequestRouted():
    """
    Will return the initial request for a given connection value (see sendInitialRequest for more information)
    """
    connection_json = request.form["connection"]
    con = conditionalJSON(connection_json)
    first_request = storage_handler.get_initial_request(con)
    first_request_json = json.dumps(first_request)
    return first_request_json
    
@storageHandler4Flask.route("/getResponse", methods = ["POST"])
def getResponseRouted():
    request_json = request.form["request"]
    req = conditionalJSON(request_json)
    response = storage_handler.get_response(req)
    response_json = json.dumps(response)
    return response_json

@storageHandler4Flask.route("/download/<path:filename>", methods = ["GET"])
def downloadTempFile(filename):
    #NAMING CONVENTION: <Unique stuff>_<Original filename>
    headers = {"Content-Disposition": "attachment; filename=%s" % filename.split("_", 1)[1]}
    directory = get_temp_location("download_files_temp")
    full_path = os.path.join(directory, filename)
    if os.path.isfile(full_path):
        with open(full_path, 'r') as f:
            body = f.read()
        #TODO: Check for rights!
        return make_response((body, headers))
    return ""


def conditionalJSON(d):
    """
    Checks if given data "d" is a string or an object.
    If the data is a string it will be loaded to an obj by using json.loads.
    Otherwise the given data object will be returned unchanged. 

    @param d object or json serialized string
    @return d as object
    """
    if isinstance(d, basestring):
        return json.loads(d)
    return d
