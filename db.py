import copy

import pymongo
from bson.objectid import ObjectId
from copy import deepcopy
from datetime import datetime
import json
from pymongo import MongoClient#, DESCENDING, ReturnDocument

import db
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

db_item_prefix = 't_item_'
db_view_prefix = 't_view_'
collection_prefix = 'tc_'


# RETURNS:
def get_all_items_for_user(id_str: str):
    collection_names = get_collection_names(id_str)
    if not collection_names:
        return None
    collection_rtn_arr = list()
    #print(len(collection_names))
    for coll_name in collection_names:
        coll_docs = db.get_item_docs(id_str, coll_name)
        #print('coll_docs', coll_docs)
        for index_num in range(len(coll_docs)):
            print(str(coll_docs[index_num]['_id']))
            coll_docs[index_num]['_id'] = str(coll_docs[index_num]['_id'])
            collection_rtn_arr.append(coll_docs)
    print('in db.py ', collection_rtn_arr)
    return collection_rtn_arr


# RETURNS:
def get_collection_names(id_str: str):
    db = mongo_client[db_item_prefix + id_str]
    db_response = list(db.list_collection_names())
    #db_response.remove(meta_coll)
    return db_response


# RETURNS:
def get_item_docs(id_str: str, item_name: str):
    db = mongo_client[db_item_prefix + id_str]
    item_docs = db[item_name]
    db_response = item_docs.find().sort('_id', 1)
    if not db_response:
        return db_response
    db_response = list(db_response)
    for element in db_response:
        #del element['_id']
        for key in element.keys():
            if isinstance(element[key], datetime):
                element[key] = datetime.strftime(element[key], datetime_format)
    return db_response


# RETURNS:
def get_item_metas(id_str: str):
    db = mongo_client[db_item_prefix + id_str]
    item_names = get_collection_names(id_str)
    arr_of_item_objs = []
    if len(item_names) <= 1:
        return 1
    if meta_coll in item_names:
        item_names.remove(meta_coll)
    for item_name in item_names:
        item_meta_doc = db[item_name].find().sort('_id', 1).limit(1)
        #print('item meta doc', item_meta_doc[0])
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
def get_item_template_attributes():
    new_item_template = c_templates.find_one({'doc_type': 'new_item_template'})
    if new_item_template:
        del new_item_template['template']['keywords']
        del new_item_template['template']['name']
    return new_item_template['template']


# RETURNS:
def item_create(id_str: str, item_obj):
    item_obj = json.loads(item_obj)
    if item_obj['name'] in get_collection_names(id_str):
        return None
    db = mongo_client[db_item_prefix + id_str]
    # test if db exists?
    item_coll = db[item_obj['name']]
    item_obj['date_created'] = datetime.utcnow()
    return item_coll.insert_one(item_obj)


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
    db = mongo_client[db_item_prefix + id_str]
    item_coll = db[item_name]
    return item_coll.insert_one(item_obj)


# RETURNS: None (if email or username already exist) | pymongo.results.InsertOneResult
# TESTED
def user_create(test_user_template):
    email_exists = c_users.find_one({'email': test_user_template['email']})
    username_exists = c_users.find_one({'username': test_user_template['username']})
    if email_exists or username_exists:
        return None
    # create user in users database:
    db_write = c_users.insert_one(test_user_template)
    if not db_write or not db_write.acknowledged:
        return None
    id_obj = copy.deepcopy(db_write.inserted_id)
    # create user's personal database, meta collection and initial meta document,
    # view collection and initial view meta document:
    new_db = mongo_client[db_item_prefix + str(db_write.inserted_id)]
    new_collection = new_db[collection_prefix + 'meta']
    db_write = new_collection.insert_one({
        'date_created': datetime.utcnow(),
        'user_id_obj': db_write.inserted_id
    })
    new_db = mongo_client[db_view_prefix + str(id_obj)]
    new_collection = new_db[collection_prefix + 'meta']
    db_write = new_collection.insert_one({
        'date_create': datetime.utcnow()
    })
    return db_write


# RETURNS:
def user_delete(id_str):
    id_exists = c_users.find_one({'_id': ObjectId(id_str)}, {'_id': 1})
    if not id_exists:
        return None
    # delete user's items:
    mongo_client.drop_database(db_item_prefix + id_str)
    # delete user's views:
    mongo_client.drop_database(db_view_prefix + id_str)
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
def user_is_active_by_id(id_str):
    is_active = c_users.find_one({'_id': ObjectId(id_str)}, {
        'active': 1,
        'username': 1
    })
    if not is_active or not is_active['active']:
        return None
    return User(id_str, is_active['username'])


# RETURNS:
def user_set_login_date(email: str):
    return c_users.update_one({'email': email}, {
        '$set': {'date_last_login': datetime.utcnow()}
    })


# RETURNS:
def user_set_logout_date(username: str):
    return c_users.update_one({'username': username}, {
        '$set': {'date_last_logout': datetime.utcnow()}
    })


# RETURNS:
def view_create(id_str: str, views_arr: list[str]):
    db = mongo_client[db_view_prefix + id_str]
    print(db)
    pass

# MAIN

if __name__ == '__main__':
    print('', view_create('6611a83ed497f8b63fe10b34', []))
