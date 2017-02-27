from flask import Blueprint, render_template
from flask import redirect, url_for

from flaskServer.LDAPManager4Flask.LDAPManager4Flask import is_logged_in

frontEnd = Blueprint('frontEnd', __name__,
                    template_folder="templates",
                    static_folder="static"
                    )

@frontEnd.route('/login')
@frontEnd.route('/')
def login():
    if(is_logged_in() == "0"):
        return redirect(url_for("frontEnd.dashboard"))
    from flaskServer.config.flaskServerConfig import get_frontend_configuration
    front_end_configuration = get_frontend_configuration()
    return render_template('login.html', c=front_end_configuration)

@frontEnd.route('/dashboard')
def dashboard():
    if(is_logged_in() == "0"):
        from flaskServer.config.flaskServerConfig import get_frontend_configuration
        front_end_configuration = get_frontend_configuration()
        return render_template('dashboard.html', c=front_end_configuration)  
    return redirect(url_for('frontEnd.login'))