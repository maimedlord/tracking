import re

from flask import Flask, redirect, render_template, request
from flask_login import LoginManager, current_user#, login_required, login_user, logout_user


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
    pass
    # user_arr = calls.get_sesh(user_id)
    # if len(user_arr) > 0:
    #     return User(user_arr[0], user_arr[1], user_arr[2], user_arr[3], user_arr[4])
    # else:
    #     return None


"""ROUTES:"""

# HERE
@app.route('/create_account', methods=['GET', 'POST'])
def create_account():
    # is user is logged in redirect them to home
    if current_user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        email = request.form['input_email']
        #NEEDS EMAIL INPUT VALIDATION
        password_1 = request.form['input_password_1']
        password_2 = request.form['input_password_2']
        #NEEDS PASSWORD INPUT VALIDATION
        username = request.form['input_username']
        if not re.match('', username):
            pass
        print(email, password_1, password_2, username)
        if password_1 != password_2:
            return render_template('create_account.html', message_correction='The passwords must match. Please try again.')
    return render_template('create_account.html')



@app.route('/', methods=['GET'])
def index():  # put application's code here
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
