from bson.objectid import ObjectId
from datetime import datetime
from pymongo import MongoClient#, DESCENDING, ReturnDocument
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


if __name__ == '__main__':
    attempt = user_create(test_user_template)
    if not attempt:
        print('twas None')
    elif attempt.acknowledged == False:
        print('unable to write to db')
    else:
        print('appears to have written')
