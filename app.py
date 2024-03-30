from datetime import datetime
import db
from flask import Flask, redirect, render_template, request
from flask_login import LoginManager, current_user, login_user, login_required, logout_user
import re
from werkzeug.security import generate_password_hash


app = Flask(__name__)
app.config.from_pyfile('config.py')

# rough
login_mgr = LoginManager()
login_mgr.init_app(app)
#login_mgr.login_message = ''
#login_mgr.login_view = ''


# for removing dangerous characters from strings passed to routes via POST/address
# def remove_danger_chars(passed_string):
#     return re.sub("[$;:&@?*%<>{}|,^]", '', passed_string)


@login_mgr.user_loader
def user_loader(user_id):
    return db.user_is_active_by_id(user_id)

### ROUTES ###


@app.route('/')
@app.route('/index')
def index():  # put application's code here
    if current_user.is_authenticated:
        return render_template('index.html', message='current_user.is_authenticated == True')
    return render_template('index.html')

# HERE
@app.route('/create_account', methods=['GET', 'POST'])
def create_account():
    # is user is logged in redirect them to home
    if current_user.is_authenticated:
        return redirect('/index')
    if request.method == 'POST':
        email = request.form['input_email']
        #NEEDS EMAIL INPUT VALIDATION
        password_1 = request.form['input_password_1']
        password_2 = request.form['input_password_2']
        #NEEDS PASSWORD INPUT VALIDATION
        username = request.form['input_username']
        if not re.match('^[\w\d_]{6,30}$', username):
            return render_template('create_account.html', message_correction='The username must be between 6 and 30 characters long consisting of lowercase/uppercase letters, numbers, and underscores. Please try again.')
        if password_1 != password_2:
            return render_template('create_account.html', message_correction='The passwords must match. Please try again.')
        db_response = db.user_create({
            'active': True,#NEED TO CHANGE THIS FOR EMAIL CONFIRMATION STEP
            'date_joined': datetime.utcnow(),
            'email': email,
            'password_hash': generate_password_hash(password_1),
            'username': username
        })
        if not db_response:
            return render_template('create_account.html', message_correction='The email or username already exist. Please try again.')
        if not db_response.acknowledged:
            return render_template('create_account.html', message_correction='Damn. The database could not be written to. Probably not good. Help!')
        #NEED log person in and now redirecto to account

    return render_template('create_account.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    # is user is logged in redirect them to home
    if current_user.is_authenticated:
        return redirect('/index')
    if request.method == 'POST':
        email = request.form['input_email']
        # NEEDS EMAIL INPUT VALIDATION
        password = request.form['input_password']
        # NEEDS PASSWORD INPUT VALIDATION
        db_response = db.user_is_authenticated(email, password)
        if not db_response:
            return render_template('login.html', message_correction='User not found. Please try again.')
        login_user(db_response)
        return redirect('/index')
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    if not current_user.is_authenticated:
        return redirect('/index')
    logout_user()
    return redirect('/index')


### MAIN ###


if __name__ == '__main__':
    app.run()
