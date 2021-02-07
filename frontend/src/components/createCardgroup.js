
import { Button, 
    Grid, 
    Card, 
    IconButton, 
    TextField
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
  


import React, { useState } from 'react';
import axios from 'axios';

import DeleteIcon from '@material-ui/icons/Delete';

import { addCardgroup, loadCardgroups, deleteCardgroup } from '../store/actions/cardgroupActions';
import { connect, useDispatch } from 'react-redux';
import {Alert} from '@material-ui/lab/';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import ShowCards from './showCards';



const CreateCardgroup = (props) => {

    

    const cardgroups = useSelector(state => state.cardgroupReducer.cardgroups)
    

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(loadCardgroups())
    }, [])   

    const deleteThisCardgroup = cardgroup => {
        dispatch(deleteCardgroup(cardgroup))   
    }
    

    let cardgroupItems = []

    cardgroups.map((cardgroup, index) => (

        cardgroupItems[index] = 
            // <div>{cardgroup.title}</div>
            <div>


                <Card key={cardgroup.id} style={{margin: "30px 0", width: "400px", padding: "10px"}}>
                    <Grid container spacing={0}> 
                        <Grid item xs={11}>

                            <div style={{fontWeight: "bold"}}>{cardgroup.title}</div>
                            <div style={{textDecoration: "underline"}}>id: {cardgroup.id}</div>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick = {() => deleteThisCardgroup(cardgroup)} > 
                                <DeleteIcon style={{fontSize: "20px"}} /> 
                            </IconButton>
                    </Grid>
                    </Grid>
                </Card>


            </div>
    ))




    const submit = e => {
        e.preventDefault()        
        if (title){
            dispatch(addCardgroup({
                title: title,                
            }))            
        }
        else{
        }
    }
    
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [title, setTitle] = useState("");
    const [numberOfCards, setNumberOfCards] = useState(0)

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    
    return(

        <React.Fragment>    

               


            <Card style={{margin: "100px 200px 0 ", padding: "100px"}}>
            <form onSubmit={submit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>

                    <h2>Create cardgroup </h2>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        onChange={e => setTitle(e.target.value)} 
                        fullWidth 
                        required 
                        variant="outlined" 
                        label="Cardgroup title"/>
                </Grid>

                <Grid item xs={12}>
                <TextField
                    fullWidth
                    id="outlined-number"
                    label="Number of flashcards for delivery pr student"
                    type="number"
                    required
                    onChange={e => setNumberOfCards(e.target.value)} 
                    variant="outlined"
                />
                </Grid>

                <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="left">
                        <KeyboardDatePicker
                        disableToolbar         
                        required    
                        inputVariant="outlined"           
                        variant="outlined"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Due date for delivery"
                        value={selectedDate}
                        
                        onChange={handleDateChange}
                        onClick={console.log("close")}
                        autoOk
                        animateYearScrolling
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        />
                        </Grid>
                </MuiPickersUtilsProvider>
                </Grid>

               

                <Grid item xs={12}>
                <Button type="submit" fullWidth style={{backgroundColor: selectedDate && title && numberOfCards ? "green" : "grey", color: "white"}}>Submit</Button>
                </Grid>

            </Grid>
                </form>
                </Card>

        
            <div style={{margin: "0 200px", color: "grey"}}>
            {cardgroupItems.length ? cardgroupItems : <h1 > no cardgroups </h1>}            
            </div>

        </React.Fragment>
    )
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         addCard: (card) => dispatch(addCard(card)),
//     }
// }

// export default connect(null, mapDispatchToProps)(CreateCard)

export default CreateCardgroup