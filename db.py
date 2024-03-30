from bson.objectid import ObjectId
from datetime import datetime
from pymongo import MongoClient#, DESCENDING, ReturnDocument
from user import User
from werkzeug.security import check_password_hash

mongo_client = MongoClient()

db_users = mongo_client['t_users']
c_users = db_users['tc_users']

test_user_template = {
    'active': True,#NEED TO CHANGE THIS FOR EMAIL CONFIRMATION EMAIL STEP
    'date_joined': datetime.utcnow(),
    'email': 'test@email.com',
    'password': 'passwordvalue',
    'username': 'testusername'
}

# RETURNS: None (if email or username already exist) | pymongo.results.InsertOneResult
# TESTED
def user_create(test_user_template):
    email_exists = c_users.find_one({'email': test_user_template['email']})
    username_exists = c_users.find_one({'username': test_user_template['username']})
    if email_exists or username_exists:
        return None
    else:
        return c_users.insert_one(test_user_template)


# RETURNS: None (if email, hashed-password combo cannot be found or user is 'inactive' | User obj
def user_is_authenticated(email, password):
    is_active = c_users.find_one({'email': email}, {
        '_id': 1,
        'active': 1,
        'password_hash': 1,
        'username': 1
    })
    print(is_active['password_hash'], is_active['username'])
    if not is_active or not is_active['active'] or not check_password_hash(is_active['password_hash'], password):
        return None
    return User(str(is_active['_id']), is_active['username'])


# RETURNS: None (if id cannot be found or user is 'inactive') | User obj
def user_is_active_by_id(user_id):
    is_active = c_users.find_one({'_id': ObjectId(user_id)}, {
        'active': 1,
        'username': 1
    })
    if not is_active or not is_active['active']:
        return None
    return User(user_id, is_active['username'])

# MAIN

if __name__ == '__main__':
    print(user_is_active_by_email('1@email.com').get_id())
