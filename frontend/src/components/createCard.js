
import { Button, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import axios from 'axios';
import { addCard, loadCards } from '../store/actions/cardActions';
import { connect, useDispatch } from 'react-redux';
import { TextField, Card } from '@material-ui/core';
import {Alert} from '@material-ui/lab/';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';



const CreateCard = (props) => {

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [back, setBack] = useState({});

    const cards = useSelector(state => state.cardReducer.cards)
    const cardAlert = useSelector(state => state.cardReducer.alert)
    

    const dispatch = useDispatch();

    console.log("is token?", localStorage.getItem("user_token"))

    useEffect(() => {
        dispatch(loadCards())
    }, [])   







    const submit = e => {
        e.preventDefault()
        
        console.log(content, title)
        if (content && title){


            try{ dispatch(addCard({
                title: title,
                content: content
            }))}
            catch {
                console.log("err")
            }

            // props.addCard({
            //     title: title,
            //     content: content
            // })

            
        }
        else{
            console.log("error here")
        }
    }
    
    
    return(

        <React.Fragment>
            {cardAlert.success ? 
                <Alert severity="success">{cardAlert.success}</Alert>   
                :
                <div></div>            
            }
            {cardAlert.error ? 
                <Alert severity="error">{cardAlert.error}</Alert>   
                :
                <div></div>            
            }
            


            <Card style={{margin: "100px", padding: "100px"}}>
            <form onSubmit={submit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>

                    <h2>Create a single card </h2>
                </Grid>
                <Grid item xs={12}>
                    <TextField onChange={e => setTitle(e.target.value)} fullWidth required variant="outlined" label="Title"/>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        onChange={e => setContent(e.target.value)}
                        id="asd"
                        label="Front"
                        multiline
                        rows={4}
                        defaultValue=""
                        // value={formData[props.formNumber]}
                        fullWidth
                        required
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                <Button type="submit" fullWidth style={{backgroundColor: "grey", color: "white"}}>Submit</Button>
                </Grid>

            </Grid>
                </form>
                </Card>
        </React.Fragment>
    )
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         addCard: (card) => dispatch(addCard(card)),
//     }
// }

// export default connect(null, mapDispatchToProps)(CreateCard)

export default CreateCard