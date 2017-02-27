from __future__ import print_function
from flask import Blueprint
from flask import request
from flask import session
from flask import make_response
import sys


LDAPManager4Flask = Blueprint('LDAPManager4Flask', __name__)

#TODO: GET should be changed to POST later on. Only here for test purposes
@LDAPManager4Flask.route('/checkCredentials', methods = ['GET'])
def check():
    from library.LDAPManager.LDAPManager import check_login
    result = (check_login(request.args.get('username'), request.args.get('password')))
    #TODO
    stay_logged_in = False
    print(request.args.get('stay'), file=sys.stderr)
    if request.args.get('stay') == "true":
        stay_logged_in = True
    resp = make_response(str(result))
    if result == 0:
        #TODO: check stay logged in variable
        login(request.args.get('username'), stay_logged_in)

    return resp

def login(username, stay_logged_in):
    print('Setting session username', file=sys.stderr)
    session['username'] = username
    if stay_logged_in:
        print('Making session permanent', file=sys.stderr)
        session.permanent = True

@LDAPManager4Flask.route("/checkLoggedIn")
def is_logged_in():
    if session.get("username") is not None:
        return "0"
    else:
        return "1"
    
@LDAPManager4Flask.route("/logout")
def logout():
    session.clear()
    return ""