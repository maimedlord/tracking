from db import mongo_client
#SESSION_COOKIE_SECURE
#SESSION_COOKIE_NAME
#SESSION_COOKIE_SAMESITE

# app server:
SECRET_KEY = 'secret!'
#UPLOAD_FOLDER = 'uploads'

# Flask-Session:
SESSION_MONGODB = mongo_client
SESSION_MONGODB_DB = 'session'
SESSION_MONGODB_COLLECT = 'c_session'
SESSION_PERMANENT = False
SESSION_TYPE = 'mongodb'
