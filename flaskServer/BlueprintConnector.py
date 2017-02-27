from flask import Blueprint


def connect_all_blueprints(app):
    connect_frontend_blueprint(app)
    connect_service_agent_blueprint(app)
    connect_ldap_manager(app)
    connect_workflow_queue_handler(app)
    connect_storage_handler(app)

def connect_frontend_blueprint(app):
    from flaskServer.frontEnd.frontEnd import frontEnd
    app.register_blueprint(frontEnd)

def connect_service_agent_blueprint(app):
    from flaskServer.serviceAgent4Flask.serviceAgent4Flask import serviceAgent4Flask
    app.register_blueprint(serviceAgent4Flask, url_prefix='/serviceAgent')

def connect_ldap_manager(app):
    from flaskServer.LDAPManager4Flask.LDAPManager4Flask import LDAPManager4Flask
    app.register_blueprint(LDAPManager4Flask, url_prefix='/ldap')

def connect_workflow_queue_handler(app):
    from flaskServer.workflowQueueHandler4Flask.workflowQueueHandler4Flask import workflowQueueHandler4Flask
    app.register_blueprint(workflowQueueHandler4Flask, url_prefix='/workflow')

def connect_storage_handler(app):
    from flaskServer.storageHandler4Flask.storageHandler4Flask import storageHandler4Flask
    app.register_blueprint(storageHandler4Flask, url_prefix='/storage')