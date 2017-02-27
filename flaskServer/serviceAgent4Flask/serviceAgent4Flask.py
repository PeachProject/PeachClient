from flask import Blueprint

serviceAgent4Flask = Blueprint('serviceAgent4Flask', __name__)

@serviceAgent4Flask.route('/retrieve')
def retrieve():
    from library.serviceAgent.serviceListRetrieve import retrieve_service_list
    return str(retrieve_service_list())
    