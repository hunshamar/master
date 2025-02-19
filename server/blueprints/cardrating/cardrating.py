
from db import db
import datetime

# import parents
from ..flashcard.flashcard import Flashcard, get_flashcard
from ..user.user import User, get_user


duplicate_ratings = db.Table("duplicate_ratings",
                             db.Column("left_rating_id", db.Integer, db.ForeignKey(
                                 "cardrating.id"), primary_key=True),
                             db.Column("right_rating_id", db.Integer, db.ForeignKey(
                                 "cardrating.id"), primary_key=True)
                             )



class Cardrating(db.Model):
    __tablename__ = "cardrating"
    # member variables
    id = db.Column(db.Integer, primary_key=True)
    index = db.Column(db.Integer)  # unique for each peer review
    difficulty = db.Column(db.Integer) # todo: rename to difficulty rating
    quality_rating = db.Column(db.Integer)
    savedatestring = db.Column(db.String(128))

    def is_complete(self):
        return self.difficulty and self.quality_rating

    # parent
    card_id = db.Column(db.Integer, db.ForeignKey("flashcard.id"))
    flashcard = db.relationship("Flashcard", back_populates="ratings")

    peerreview_id = db.Column(db.Integer, db.ForeignKey("peerreview.id"))
    peerreview = db.relationship("Peerreview", back_populates="ratings")

    # children
    duplicates = db.relationship("Cardrating",
                                 secondary=duplicate_ratings,
                                 primaryjoin=id == duplicate_ratings.c.left_rating_id,
                                 secondaryjoin=id == duplicate_ratings.c.right_rating_id,
                                 backref="left_ratings"
                                 )

    def to_duplicate_dict(self):
        return {
            "id": self.id,
            "index": self.index,
            "card": Flashcard.query.get(self.card_id).public_to_dict(),
        }

    def to_dict(self):

        return {
            "id": self.id,
            "index": self.index,
            "difficulty": self.difficulty,
            "quality_rating": self.quality_rating,
            "savedatestring": self.savedatestring,
            "peerreviewId": self.peerreview_id,
            # "duplicates": duplicates,
            "card": Flashcard.query.get(self.card_id).public_to_dict(),
            "duplicates": [d.to_duplicate_dict() for d in self.duplicates]
        }


def index_peerreview_id_to_rating_id(index, peerreview_id):

    ratings = Cardrating.query.filter_by(
        index=index, peerreview_id=peerreview_id).all()
    if len(ratings) > 1:
        raise Exception("Error. Duplicate indexes for this peer review")
    if not len(ratings):
        raise Exception("Error. No rating for this index and peer review")

    return ratings[0].id


def remove_duplicate(rating, duplicate_rating):

    rating.duplicates.remove(duplicate_rating)
    duplicate_rating.duplicates.remove(rating)

    rating.savedatestring = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    duplicate_rating.savedatestring = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def add_duplicate(rating, duplicate_rating):
    rating.duplicates.append(duplicate_rating)
    duplicate_rating.duplicates.append(rating)

    rating.savedatestring = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    duplicate_rating.savedatestring = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def edit_duplicates(user_id, rating_id, duplicates):

    rating = Cardrating.query.get(rating_id)
    peerreview = rating.peerreview

    current_gmt_time = datetime.datetime.now(
        datetime.timezone.utc).replace(tzinfo=None)

    if current_gmt_time > peerreview.cardgroup.peer_review_due_date:
        raise Exception("Error. Due date for rating exceeded")

    old_duplicates = rating.duplicates.copy()

    new_duplicates = [Cardrating.query.get(d["id"]) for d in duplicates]

    print("old duplicates")
    for d in old_duplicates:
        print(d.id)

    print("new duplicates")
    for d in new_duplicates:
        print(d.id)

    print("----")

    # gå gjennom gammel liste, fjern alle som ikke er med i ny
    for d in old_duplicates:

        print("id:", d.id)
        if d not in new_duplicates:
            print(d.id, "not in new")
            remove_duplicate(rating, d)

    # gå gjennom ny liste, legg til alle som ikke er med i gammel
    for d in new_duplicates:
        if d not in old_duplicates:
            add_duplicate(rating, d)
            print("not in old", d.id)

    db.session.commit()

    return [r.to_dict() for r in Cardrating.query.filter_by(peerreview_id=peerreview.id).order_by(Cardrating.id).all()]


def save_difficulty_rating(user_id, rating_id, difficulty_rating):
    rating = Cardrating.query.get(rating_id)

    peerreview = rating.peerreview
    current_gmt_time = datetime.datetime.now(
        datetime.timezone.utc).replace(tzinfo=None)
    if current_gmt_time > peerreview.cardgroup.peer_review_due_date:
        raise Exception("Error. Due date for rating exceeded")

    if rating.peerreview.user_id != user_id:
        raise Exception("Other users rating error")

    rating.difficulty = difficulty_rating
    rating.savedatestring = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.session.commit()

    # Avg ratings already exists, i.e. average rating must be calculated again
    if rating.flashcard.average_difficulty:
        rating.flashcard.calculate_average_rating()

    return rating


def save_quality_rating(user_id, rating_id, quality_rating):
    rating = Cardrating.query.get(rating_id)

    peerreview = rating.peerreview

    current_gmt_time = datetime.datetime.now(
        datetime.timezone.utc).replace(tzinfo=None)
    if current_gmt_time > peerreview.cardgroup.peer_review_due_date:
        raise Exception("Error. Due date for rating exceeded")

    if rating.peerreview.user_id != user_id:
        raise Exception("Other users rating error")

    rating.quality_rating = quality_rating
    rating.savedatestring = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.session.commit()

    # Avg ratings already exists, i.e. average rating must be calculated again
    if rating.flashcard.average_rating:
        rating.flashcard.calculate_average_rating()

    return rating


def save_rating(user_id, rating_id, difficulty, quality_rating):

    rating = Cardrating.query.get(rating_id)

    peerreview = rating.peerreview

    current_gmt_time = datetime.datetime.now(
        datetime.timezone.utc).replace(tzinfo=None)
    if current_gmt_time > peerreview.cardgroup.peer_review_due_date:
        raise Exception("Error. Due date for rating exceeded")


    if rating.peerreview.user_id != user_id:
        raise Exception("Other users rating error")

    if difficulty:
        rating.difficulty = difficulty

    if quality_rating:
        rating.quality_rating = quality_rating

    rating.savedatestring = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db.session.commit()

    return rating.to_dict()



def get_all_ratings():
    ratings = Cardrating.query.all()
    if not ratings:
        raise Exception("Error finding ratings. No ratings")
    return [i.to_dict() for i in ratings]


def delete_ratings_of_card(cid):

    ratings = Cardrating.query.filter_by(card_id=cid).all()
    for rating in ratings:
        db.session.delete(rating)
    db.session.commit()


def delete_all_cardratings():
    ratings = Cardrating.query.all()
    for r in ratings:
        db.session.delete(r)
    db.session.commit()
