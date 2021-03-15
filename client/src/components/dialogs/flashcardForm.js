
import { Button, 
    Grid,  
    TextField,
    Dialog,
    Typography,
    makeStyles
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCard, editCard } from '../../store/actions/cardActions';

const useStyles = makeStyles(theme => ({
    dialog: {
        "& .MuiDialog-paperScrollPaper": {
            maxHeight: "100vh",
        },
    }
}))

const FlashcardForm = (props) => {
    const { onClose, selectedValue, open } = props;
    const dispatch = useDispatch();    
    const classes = useStyles()

    const [front, setFront] = useState("")
    const [back, setBack] = useState("")
  

    
    useEffect(() => {
        if (props.card){
            console.log("cccc", props.card)
            setFront(props.card.front)
            setBack(props.card.back)
        }
    }, [props.card])
    

   

    const submit = e => {
        e.preventDefault()
        
        if (front && back){
            
            if (props.card){
             dispatch(editCard({
                front: front,
                back: back,
                id: props.card.id
                }))
            }
            // else {
            //     dispatch(addCard({
            //         front: front,
            //         back: back,
            //         cardgroupid: cardgroupId
            //         }))
            // }
            

            handleClose()
            
        }
        else{
            alert("fill inn all fields")
            // console.log(front, back, cardgroupId)
        }
    }

    const handleClose = () => {

        onClose(selectedValue);
    };
  
    // return 

    return (
      <Dialog onClose={handleClose} 
        className={classes.dialog}

       open={open} >

        <form onSubmit={submit} style={{margin: "40px"}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5">Edit a flashcard </Typography>
                </Grid>
                {/* <Grid item xs={12}>
                    <CardgroupSelect onChange={e => setCardgroupid(e)} />
                </Grid> */}
                <Grid item xs={12}>
                    <TextField 
                        onChange={e => setFront(e.target.value)} 
                        fullWidth 
                        required 
                        variant="outlined"
                        color="secondary"
                        label="Front"
                        value={front}
                        multiline
                        rows={4}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        onChange={e => setBack(e.target.value)}
                        id="asd"
                        label="Back"
                        color="secondary"
                        multiline
                        rows={4}
                        defaultValue=""
                        value={back}
                        fullWidth
                        required
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" onClick={handleClose} fullWidth color="primary"  > Back</Button>
                </Grid>
                <Grid item xs={6}>
                <Button type="submit" fullWidth style={{backgroundColor: front && back ? "green" : "grey", color: "white"}}>{props.card ? "edit" : "submit"}</Button>
                
                </Grid>

            </Grid>
                </form>

        

      </Dialog>
    );
}

export default FlashcardForm