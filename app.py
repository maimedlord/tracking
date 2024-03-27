from flask import Flask, render_template
from flask_login import LoginManager#, login_required, login_user, logout_user, current_user


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


# ROUTES:
@app.route('/create_account', methods=['GET'])
def create_account():
    pass


@app.route('/', methods=['GET'])
def index():  # put application's code here
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
