from flask import Flask
import BlueprintConnector
import sys
import config.flaskServerConfig as FlaskConfig
FlaskConfig.init_library()
from updateScripts import updateScripts
from library import onStart


sys.path.insert(0, FlaskConfig.get_schema_folder())

app = Flask(__name__, static_folder=None)
app.secret_key = FlaskConfig.get_private_session_key()
BlueprintConnector.connect_all_blueprints(app)

updateScripts()

#library consumers
onStart.start()

app.run(host="0.0.0.0")
