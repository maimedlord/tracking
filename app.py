from flask import Flask, render_template
from flask_login import LoginManager#, login_required, login_user, logout_user, current_user
from pymongo import MongoClient#, DESCENDING, ReturnDocument

app = Flask(__name__)
app.config.from_pyfile('config.py')

# rough
login_mgr = LoginManager()
login_mgr.init_app(app)
#login_mgr.login_message = ''
#login_mgr.login_view = ''
mongo_client = MongoClient()


@app.route('/create_account', methods=['GET'])
def create_account():
    pass


@app.route('/', methods=['GET'])
def index():  # put application's code here
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
