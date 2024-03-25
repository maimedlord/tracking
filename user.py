from flask_login import UserMixin


class User(UserMixin):
    def __init__(self, email: str, id_obj, id_str: str):
        self.email = email
        self.id_obj = id_obj
        self.id_str = id_str

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True


    # def get_id_str(self):
    #     return self.id_str


    # def build_user(self):
    #     return None