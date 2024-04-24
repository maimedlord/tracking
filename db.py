import pymongo
from bson.objectid import ObjectId
from datetime import datetime
import json
from pymongo import MongoClient#, DESCENDING, ReturnDocument
from user import User
from werkzeug.security import check_password_hash

mongo_client = MongoClient()

datetime_format = '%Y-%m-%dT%H:%M'
#datetime_format = '%Y-%m-%d %H:%M:%S%z'
db_misc = mongo_client['t_misc']
db_users = mongo_client['t_users']
c_templates = db_misc['tc_templates']
c_users = db_users['tc_users']
meta_coll = 'tc_meta'
meta_doc_amt = 1

database_prefix = 't_'
collection_prefix = 'tc_'


# RETURNS:
def item_create(id_str: str, item_obj):
    item_obj = json.loads(item_obj)
    if item_obj['name'] in get_collection_names(id_str):
        return None
    db = mongo_client[database_prefix + id_str]
    # test if db exists?
    item_coll = db[item_obj['name']]
    item_obj['date_created'] = datetime.utcnow()
    return item_coll.insert_one(item_obj)


# RETURNS:
def get_item_docs(id_str: str, item_name: str):
    db = mongo_client[database_prefix + id_str]
    item_docs = db[item_name]
    db_response = item_docs.find().sort('_id', 1)
    if not db_response:
        return db_response
    db_response = list(db_response)
    for element in db_response:
        del element['_id']
        for key in element.keys():
            if isinstance(element[key], datetime):
                element[key] = datetime.strftime(element[key], datetime_format)
    return db_response


# RETURNS:
def get_item_template_attributes():
    new_item_template = c_templates.find_one({'doc_type': 'new_item_template'})
    if new_item_template:
        del new_item_template['template']['keywords']
        del new_item_template['template']['name']
    return new_item_template['template']


# RETURNS:
def item_track(item_name: str, id_str: str, item_obj):
    # swap out blank values for null
    for attribute in item_obj.keys():
        if attribute == 'time noticed':
            if item_obj[attribute] == '':
                item_obj[attribute] = datetime.utcnow()
            else:
                item_obj[attribute] = datetime.strptime(item_obj[attribute], datetime_format)
        if item_obj[attribute] == '':
            item_obj[attribute] = None
    db = mongo_client[database_prefix + id_str]
    item_coll = db[item_name]
    return item_coll.insert_one(item_obj)


# RETURNS:
def get_collection_names(id_str: str):
    db = mongo_client[database_prefix + id_str]
    db_response = list(db.list_collection_names())
    #db_response.remove(meta_coll)
    return db_response


# RETURNS:
def get_item_metas(id_str: str):
    db = mongo_client[database_prefix + id_str]
    item_names = get_collection_names(id_str)
    arr_of_item_objs = []
    if len(item_names) <= 1:
        return 1
    if meta_coll in item_names:
        item_names.remove(meta_coll)
    for item_name in item_names:
        item_meta_doc = db[item_name].find().sort('_id', 1).limit(1)
        print('item meta doc', item_meta_doc[0])
        num_of_docs = db[item_name].count_documents({}) - meta_doc_amt
        item_obj = {
            'item_name': item_name,
            'item_count': num_of_docs,
            'date_created': datetime.strftime(item_meta_doc[0]['date_created'], datetime_format),
            'keywords': item_meta_doc[0]['keywords']
        }
        # if item has more than meta doc, add late time it was tracked to object
        if num_of_docs > 0:
            datetime_obj = db[item_name].find().sort('_id', -1).limit(1)[0]['time noticed']
            item_obj['date_last_noticed'] = datetime.strftime(datetime_obj, datetime_format)
        arr_of_item_objs.append(item_obj)
    return arr_of_item_objs


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
    print(''    )
