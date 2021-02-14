import { CREATE_CARD, CREATE_CARD_ERROR, DELETE_CARD, DELETE_CARD_ERROR, EDIT_CARD, LOAD_CARD, LOAD_CARDS } from "../actionTypes"

const initState = {
    cards: [
       
    ]
}

const cardReducer = (state = initState, action) => {
    switch(action.type) {
        case CREATE_CARD:
            console.log("created card", action.payload)
            // alert(action.err)

            console.log(state)
            console.log({ 
                ...state,
                cards: [...state.cards, action.payload],
            })

            return { 
                ...state,
                cards: [...state.cards, action.payload],
            }
        // case EDIT_CARD:

        //     console.log("card changed...")
        //     console.log(action.payload)
        //     return { 
        //         ...state,
        //         cards: [...state.cards, action.createdCard],
        //         cards: state.cards.filter((card) => card.id !== action.card.id
        //     }


            


        case CREATE_CARD_ERROR:
            return { 
                ...state,

            }
            return state;
        case LOAD_CARD:
            console.log("got card", action.card)
            return {
                ...state, 
                cards: action.payload,
            }
        
        case LOAD_CARDS:
            console.log("got cards", action.cards)
            console.log({...state, cards: action.cards})
            return {
                ...state, 
                cards: action.cards,
            }
        case DELETE_CARD:
            console.log("deleting dem cards")
            console.log(state.cards)
            console.log(state.cards.filter(card => card.id !== action.payload.id))
           

            return { 
                ...state,
                cards: state.cards.filter((card) => card.id !== action.payload.id),
            }
            // return state;
        
        case DELETE_CARD_ERROR:
            return state
            // return state
        
        default:
            return state;
    }
}

export default cardReducer