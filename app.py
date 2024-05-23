import copy
import json
from datetime import datetime
import db
from flask import abort, Flask, redirect, render_template, request, session, url_for
from flask_login import LoginManager, current_user, login_user, login_required, logout_user
from flask_session import Session
import re
from urllib.parse import urlparse, urljoin
from werkzeug.security import generate_password_hash


app = Flask(__name__)
app.config.from_pyfile('config.py')

Session(app)

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


# for logging in user... // MIGHT NEED TO GET PRESENT FOR ALL REDIRECTS???
def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc


def remove_danger_chars(input: str) -> str:
    return re.sub("[;#:&@?*%<>{}|,^]", '', input)


# write parameter to app.log:
def write_to_app_log(message: str):
    try:
        app_log = open('/logs/app.log', 'a')
        app_log.write(message)
        app_log.close()
    finally:
        pass

### ROUTES ###


@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():  # put application's code here
    if current_user.is_authenticated:
        return redirect('/console')
    if request.method == 'POST':
        email = request.form['input_email']
        password = request.form['input_password']
        session['email'] = request.form['input_email']
        session['password'] = request.form['input_password']
        if session['email'] and session['password']:
            return redirect('/login')
    return render_template('index.html', message='')


@app.route('/account')
@login_required
def account():
    return render_template('account.html')


@app.route('/console', methods=['GET', 'POST'])
@login_required
def console():
    banana = 'banankjhlkjhlkjhlkja'
    return render_template('console.html', banana=banana)


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
        try:
            db_response = db.user_create({
                'active': True,  # NEED TO CHANGE THIS FOR EMAIL CONFIRMATION STEP
                'date_last_login': None,
                'date_last_logout': None,
                'date_joined': datetime.utcnow(),
                'email': email,
                'password_hash': generate_password_hash(password_1),
                'username': username
            })
        except:
            write_to_app_log(str(datetime.utcnow()) + ' - 1 - db.user_create() crashed')
        else:
            if not db_response:
                return render_template('create_account.html', message_correction='The email or username already exist. Please try again.')
            if not db_response.acknowledged:
                return render_template('create_account.html', message_correction='Damn. The database could not be written to. Probably not good. Help!')
            return redirect('/login')
    return render_template('create_account.html')


@app.route('/delete_account')
@login_required
def delete_account():
    db_response = db.user_delete(current_user.id_str)
    logout_user()
    session.clear()
    return redirect('/index')


# NEEDS INPUT VALIDATION
# @app.route('/item_create', methods=['GET', 'POST'])
# @login_required
# def item_create():
#     # get list of item attributes
#     item_attributes = db.item_get_template_attributes()
#     if request.method == 'POST':
#         # NEEDS INPUT VALIDATION
#         db_response = db.item_create(current_user.id_str, request.form.to_dict())
#         if not db_response:
#             return render_template('item_create.html', error_msg='your item could not be created')
#         return render_template('item_create.html', message='Your item has been created!')
#     return render_template('item_create.html', item_attributes=item_attributes.keys())


@app.route('/item_create/<item_obj>', methods=['GET', 'POST'])
@login_required
def item_create(item_obj):
    print(item_obj)
    # NEEDS INPUT VALIDATION
    db_response = db.item_create(current_user.id_str, item_obj)
    print(db_response)
    if not db_response:
        return 'your item could not be created. perhaps it already exists?'
    return 'Your item has been created!'


@app.route('/item_doc_refresh_list/<item_name>', methods=['GET', 'POST'])
@login_required
def item_doc_refresh_list(item_name):
    db_response = db.get_item_docs(current_user.id_str, item_name)
    if not db_response or len(db_response) == 1:
        return json.dumps({
            'status': 'fail',
            'data': 'There are no items to refresh...'
        })
    return json.dumps({
        'status': 'success',
        'data': db_response
    })


@app.route('/item_manage/<item_name>', methods=['GET', 'POST'])
@login_required
def item_manage(item_name):
    db_response = db.get_item_docs(current_user.id_str, item_name)
    print('teh db response', db_response)
    # swap out None values for ''
    for doc in db_response:
        for attribute in doc.keys():
            if not doc[attribute]:
                doc[attribute] = ''
    return render_template('item_manage.html', item_docs=db_response, item_name=item_name)


@app.route('/items_manage')
@login_required
def items_manage():
    #item_names = db.get_collection_names(current_user.id_str)
    return render_template('items_manage.html')


# INCOMPLETE NEED WORK NOW
@app.route('/item_refresh_list')
@login_required
def item_refresh_list():
    db_response = db.get_item_metas(current_user.id_str)
    if db_response == 1:
        return json.dumps({
            'status': 'fail',
            'data': 'There are no items to refresh...'
        })
    return json.dumps({
        'status': 'success',
        'data': db_response
    })


@app.route('/item_track_api/<item_obj>', methods=['GET', 'POST'])
@login_required
def item_track_api(item_obj):
    pass


@app.route('/item_track/<item_name>', methods=['GET', 'POST'])
@login_required
def item_track(item_name):
    item_attributes = db.get_item_template_attributes()
    print(item_attributes)
    item_history = db.get_item_docs(current_user.id_str, item_name)
    item_meta = item_history[0]
    # remove meta document from item_history
    item_history.pop(0)
    if request.method == 'POST':
        # NEED INPUT VALIDATION
        db_response = db.item_track(item_name, current_user.id_str, request.form.to_dict())
        if not db_response:
            return render_template('item_track.html', error_msg='your item could not be tracked.')
        return redirect(url_for('item_track', item_attributes=item_attributes, item_docs=item_history, item_meta=item_meta, item_name=item_name))
    return render_template('item_track.html', item_attributes=item_attributes, item_docs=item_history, item_meta=item_meta, item_name=item_name)


@app.route('/login', methods=['GET', 'POST'])
def login():
    # is user is logged in redirect them to home
    if current_user.is_authenticated:
        return redirect('/index')
    email = ''
    password = ''
    # check if session email and password values are assigned
    if 'email' in session.keys():
        email = session['email']
        session['email'] = ''
    if 'password' in session.keys():
        password = session['password']
        session['password'] = ''
    # POST will overwrite anything from the session
    if request.method == 'POST':
        email = request.form['input_email']
        password = request.form['input_password']
    if email and password:
        # NEEDS EMAIL INPUT VALIDATION
        # NEEDS PASSWORD INPUT VALIDATION
        db_response = db.user_is_authenticated(email, password)
        if not db_response:
            return render_template('login.html', message_correction='User not found. Please try again.')
        login_user(db_response)
        db_response = db.user_set_login_date(email)
        # the entire following sequence needs to be fully understood:
        next = request.args.get('next')
        print('YOU NEED TO MAKE SURE THAT THIS LOGIN PROCEDURE IS SAFE: NEXT IS_SAFE_URL(NEXT)')
        print(next)
        if not is_safe_url(next):
            return abort(400)
        #return redirect(url_for('account'))
        return redirect('/console')
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    username = current_user.username
    # clear flask-login session
    logout_user()
    # log logout
    db_response = db.user_set_logout_date(username)
    # clear server-side session
    session.clear()
    return redirect('/index')


@app.route('/test_api/<input1>/<input2>')
@login_required
def test_api(input1: str, input2: str):
    return 'this is a response'


@app.route('/view_create/<view_obj>')
@login_required
def view_create(view_obj):
    pass


@app.route('/views_manage')
@login_required
def views_manage():
    return render_template('views_manage.html')

### MAIN ###


if __name__ == '__main__':
    print(remove_danger_chars('asfq34ftWQE%$#^@#^%#s\];/.,lkasdf'))
    app.run()
