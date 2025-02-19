from db import db

class InvalidToken(db.Model):
    __tablename__ = "invalid_tokens"
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(128))

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_invalid(self, jti):
        q = self.query.filter_by(jti=jti).first()
        return bool(q)

