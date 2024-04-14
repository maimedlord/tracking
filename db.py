import pymongo
from bson.objectid import ObjectId
from datetime import datetime
from pymongo import MongoClient#, DESCENDING, ReturnDocument
from user import User
from werkzeug.security import check_password_hash

mongo_client = MongoClient()

db_users = mongo_client['t_users']
c_users = db_users['tc_users']
meta_coll = 'tc_meta'

database_prefix = 't_'
collection_prefix = 'tc_'
# test_user_template = {
#     'active': True,#NEED TO CHANGE THIS FOR EMAIL CONFIRMATION EMAIL STEP
#     'date_joined': datetime.utcnow(),
#     'date_last_login': None,
#     'date_last_logout': None,
#     'email': 'test@email.com',
#     'password': 'passwordvalue',
#     'username': 'testusername'
# }


# RETURNS:
def item_create(id_str: str, item_obj):
    # print(item_obj.keys())
    # print('break')
    # print(item_obj.values())
    db = mongo_client[database_prefix + id_str]
    # test if db exists?
    item_coll = db[item_obj['name']]
    return item_coll.insert_one(item_obj)


# RETURNS:
def item_get_all_docs(id_str: str, item_name: str):
    db = mongo_client[database_prefix + id_str]
    item_docs = db[item_name]
    db_response = item_docs.find().sort('_id', pymongo.ASCENDING)
    db_response = list(db_response)
    for element in db_response:
        del element['_id']
    return db_response


# NEED TO CHANGE HOW TEMPLATE IS FOUND BY USING FIND_ONE AND OLDEST RECORD
# RETURNS:
def item_get_template(id_str: str, item_name: str):
    db = mongo_client[database_prefix + id_str]
    item_docs = db[item_name]
    db_response = item_docs.find().sort('_id', pymongo.ASCENDING)
    db_response = list(db_response)
    db_response = db_response[0]
    del db_response['_id']
    del db_response['keywords']
    db_response = list(db_response.keys())
    return db_response


# RETURNS:
def get_collection_names(id_str: str):
    db = mongo_client[database_prefix + id_str]
    db_response = list(db.list_collection_names())
    #db_response.remove(meta_coll)
    print(type(db_response), '//', db_response)
    return db_response



# RETURNS:
def record_login_date(email):
    return c_users.update_one({'email': email}, {
        '$set': {'date_last_login': datetime.utcnow()}
    })


# RETURNS:
def record_logout_date(username):
    return c_users.update_one({'username': username}, {
        '$set': {'date_last_logout': datetime.utcnow()}
    })


# RETURNS: None (if email or username already exist) | pymongo.results.InsertOneResult
# TESTED
def user_create(test_user_template):
    email_exists = c_users.find_one({'email': test_user_template['email']})
    username_exists = c_users.find_one({'username': test_user_template['username']})
    if email_exists or username_exists:
        return None
    # create user in users database:
    db_write = c_users.insert_one(test_user_template)
    if db_write and db_write.acknowledged:
        print(db_write.inserted_id)
        new_db = mongo_client[database_prefix + str(db_write.inserted_id)]
        new_collection = new_db[collection_prefix + 'meta']
        # create user's personal database, meta collection and initial meta document:
        db_write = new_collection.insert_one({
            'date_created': datetime.utcnow(),
            'user_id_obj': db_write.inserted_id
        })
        return db_write
    else:
        return None


# RETURNS:
def user_delete(id_str):
    id_exists = c_users.find_one({'_id': ObjectId(id_str)}, {'_id': 1})
    if not id_exists:
        return None
    # delete user's personal db:
    db_delete = mongo_client.drop_database(database_prefix + str(id_exists['_id']))
    # delete user's user record:
    c_delete = c_users.delete_one({'_id': id_exists['_id']})
    return c_delete


# RETURNS: None (if email, hashed-password combo cannot be found or user is 'inactive' | User obj
def user_is_authenticated(email, password):
    is_active = c_users.find_one({'email': email}, {
        '_id': 1,
        'active': 1,
        'password_hash': 1,
        'username': 1
    })
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
    print(item_create('6611a83ed497f8b63fe10b34', {'name': 'trackable12', 'color': 'red', 'created': datetime.utcnow()}))
