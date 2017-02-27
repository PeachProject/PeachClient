from flask import Blueprint
from flask import request
from flask import session
import json

workflowQueueHandler4Flask = Blueprint('workflowQueueHandler4Flask', __name__)

@workflowQueueHandler4Flask.route('/send', methods = ['POST'])
def sendWorkflow():
    workflow_json = request.form["workflow"]
    workflow = json.loads(workflow_json)
    from library.workflowQueueHandler.workflowExecutionHandler import sendExecution
    sendExecution(workflow)
    return ""

@workflowQueueHandler4Flask.route('/receive', methods = ['POST'])
def receiveQueue():
    username = session['username']
    if username is None:
        return "Error - Not logged in"
    status = request.form.get("status")
    if status is None:
        status = -1
    from library.workflowQueueHandler.workflowQueueReceiver import receive_queue
    from flaskServer.config.flaskServerConfig import get_mysql_info
    mysql_info = get_mysql_info()
    result = receive_queue(mysql_info, "queue", username, status)
    return json.dumps(result)

@workflowQueueHandler4Flask.route('/remove', methods = ['POST'])
def removeQueueItem():
    username = session['username']
    if username is None:
        return "Error - Not logged in"
    index = request.form["id"]
    if index is None:
        return "Invalid index"
    from library.workflowQueueHandler.workflowQueueItemRemoval import remove_queue_item
    from flaskServer.config.flaskServerConfig import get_mysql_info
    mysql_info = get_mysql_info()
    remove_queue_item(mysql_info, "queue", index, username)
    return ""