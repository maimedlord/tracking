from bson.objectid import ObjectId
from datetime import datetime
from pymongo import MongoClient#, DESCENDING, ReturnDocument
from werkzeug.security import check_password_hash

mongo_client = MongoClient()

