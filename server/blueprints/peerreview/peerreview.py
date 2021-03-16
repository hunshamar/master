
from db import db
import datetime
from flask import jsonify

# import parents
from ..flashcard.flashcard import Flashcard, getFlashcard
# from ..user.user import User, getUser

import random

from ..cardgroup.cardgroup import Cardgroup
from ..user.user import User
# from ..cardrating.cardrating import Cardrating

MAX_NUMBER_OF_REVIEWS = 40

peer_review_cards = db.Table('peer_review_cards', 
    db.Column('id', db.Integer, primary_key=True),
    db.Column('flashcard_id', db.Integer, db.ForeignKey('flashcard.id')),
    db.Column('peerreview_id', db.Integer, db.ForeignKey('peerreview.id'))
)

class Peerreview(db.Model):
    __tablename__ = "peerreview"

    #member variables

    id = db.Column(db.Integer, primary_key=True)

    due_date = db.Column(db.DateTime)
    reviews_per_student = db.Column(db.Integer)

    # parent
    cardgroup_id = db.Column(db.Integer, db.ForeignKey("cardgroup.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    # children
    flashcards = db.relationship("Flashcard", secondary=peer_review_cards, backref="flashcard")
    ratings = db.relationship("Cardrating", backref="cardrating")
    
    # flashcard_ids = db.Column(db.ARRAY(db.Integer)

    

    def to_dict(self):     
        return {
            "id": self.id, 
            "dueDate": self.due_date.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "cardgroup": Cardgroup.query.get(self.cardgroup_id).to_dict(),
            "userId": self.user_id,
            "reviewsDue": self.reviews_per_student
        }

    def get_flashcards(self):
        return [f.public_to_dict() for f in self.flashcards]
        
    def get_ratings(self):
        print("n ratings", len(self.ratings))
        return [r.to_dict() for r in self.ratings]

    # constructor, add 20 random cards from cardgroup for each student
    def __init__(self, cardgroup, user, due_date, reviews_per_student, cardids):
        print(f"Creating peer review for '{cardgroup.title}' for user '{user.username}'")
        self.cardgroup_id = cardgroup.id
        self.user_id = user.id
        self.due_date = due_date
        self.reviews_per_student = reviews_per_student
        self.flashcards = cardgroup.get_cards_from_ids(cardids)

def addPeerReview(cardgroup_id, user_id, due_date, reviews_per_student): 

    user = User.query.get(user_id)
    cardgroup = Cardgroup.query.get(cardgroup_id)  
    peerreview = Peerreview(cardgroup, user, due_date, reviews_per_student)
    print("done")

    # flashcards = cardgroup.get_n_random_cards(reviews_per_student)

    flashcards = cardgroup.get_cards_from_ids(idarr)

    # for f in flashcards:
    #     peerreview.flashcards.append(f)


    db.session.add(peerreview)
    db.session.commit()

def getPeerReview(pid):
    return Peerreview.query.get(pid).to_dict()

#
# picks random cards for users, but ensured all cards are picked the same number of times
#
def pickRandomCards(cardids, number_of_users, reviews_per_user):

    users_cards = []
    for n in range(number_of_users):
        users_cards.append([])


    cards = cardids.copy()
    random.shuffle(cards)
    for u in range(number_of_users):
        # not enough cards to draw from ?
        if (len(cards) < reviews_per_user): 

            # take all remaining cards     
            users_cards[u] += cards 
    
            # create new random cards
            cards = cardids.copy()
            random.shuffle(cards)
            
            # fill remaining cards
            for n in range(reviews_per_user - len(users_cards[u])):
                for i, c in enumerate(cards):
                    if c not in users_cards[u]:                        
                        users_cards[u].append(cards.pop(i))
                        break

        else:
            for n in range(reviews_per_user):
                
                for i, c in enumerate(cards):
                    if c not in users_cards[u]:                        
                        users_cards[u].append(cards.pop(i))
                        break



    return users_cards






def addPeerReviewForAllStudents(cardgroup_id, due_date, reviews_per_student):


    current_gmt_time = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
      
    if (cardgroup_id and due_date and reviews_per_student):        
        if due_date < current_gmt_time: 
            raise Exception("Due date can not be in the past")
        if int(reviews_per_student) < 1:
            raise Exception("Number of reviews must be larger than 0")
        if int(reviews_per_student) > MAX_NUMBER_OF_REVIEWS:
            raise Exception("Number of reviews are limited to "+str(MAX_NUMBER_OF_REVIEWS))

    print(cardgroup_id)



    cardgroup = Cardgroup.query.get(cardgroup_id)

    print(cardgroup.id)

    users = User.query.all()

    card_ids=[]
    cards = cardgroup.flashcards
    for c in cards:
        card_ids.append(c.id)
    
    peer_review_user_cards = pickRandomCards(card_ids, len(users), reviews_per_student)


    for index, user in enumerate(users):
    
        if(Peerreview.query.filter_by(user_id=user.id, cardgroup_id=cardgroup.id)).first():
            print("Peer review already exists for this group, for this student with id", user.id)
        else:
            print("create peer review")
            peerreview = Peerreview(cardgroup, user, due_date, reviews_per_student, peer_review_user_cards[index])
            
            # for i in flashcards:
            #     peerreview.flashcards.append(i)
            # db.session.add(peerreview)


    print("added to sesh")
    db.session.commit()


def getAllPeerreviews():
    peerreviews = Peerreview.query.all()

    return [i.to_dict() for i in peerreviews]

def getUserPeerreviews(uid):
    peerreviews = Peerreview.query.filter_by(user_id=uid).all()
    return [p.to_dict() for p in peerreviews]

def deleteAllPeerReviews():
    re = Peerreview.query.all()
    for r in re:
        db.session.delete(r)

    db.session.commit()

def getPeerreviewCards(pid):
    peerreview = Peerreview.query.get(pid)
    if not peerreview:
        raise Exception("Peer review not found with id", pid)
    return peerreview.get_flashcards()

def getRatingsInPeerreview(pid, uid):
    # flashcards = Peerreview.query.get(pid).flashcards
    # print("getting")

    # ratings = []
    # for f in flashcards:
    #     print("flsahcard", f.front)
    #     rating = Cardrating.query.filter_by(user_id=uid, card_id=f.id).first()
    #     if rating:
    #         ratings.append(rating)



    
    return [r.to_dict() for r in ratings]
