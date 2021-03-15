
import { Button, 
    Grid, 
    TextField,
    Dialog,
    Typography,
    makeStyles,
    Input,
    InputAdornment,
    IconButton,
    Tooltip
} from '@material-ui/core';
import React, { useState } from 'react';

import {  useDispatch } from 'react-redux';
import { addCard } from '../../store/actions/cardActions';
import UploadImage from '../submodules/uploadImage';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    dialog: {
        "& .MuiDialog-paperScrollPaper": {
            maxHeight: "100vh",
        },
    },
}))

const CreateCardDialog = (props) => {
    const { onClose, selectedValue, open } = props;
    const dispatch = useDispatch();    
    const classes = useStyles()
    const cardgroupId = props.cardgroupId

    const [front, setFront] = useState("")
    const [back, setBack] = useState("")

   

    const submit = e => {
        e.preventDefault()
        console.log("id", cardgroupId)
        
        if (front && back && cardgroupId){


            try{ dispatch(addCard({
                front: front,
                back: back,
                cardgroupid: cardgroupId
            }))}
            catch {
            }
            setFront("")
            setBack("")
            handleClose()
            
        }
        else{
            alert("fill inn all fields")
            console.log(front, back, cardgroupId)
        }
    }

    const handleClose = () => {
        onClose(selectedValue);
    };
  
  
    return (
      <Dialog onClose={handleClose} 
        className={classes.dialog}

       open={open} >

        <form onSubmit={submit} style={{margin: "40px"}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>

                    <Typography variant="h5">Create a flashcard. This can be edited later </Typography>
                    <Typography variant="body2" color="textSecondary"> You can write either pure text or use HTML. <Link  to="/htmlguide" target="_blank">HTML Guide</Link> 
                    <br/>
                    Make sure the Card looks good in <i>Preview Flashcard</i> if writing in HTML.
                     </Typography>
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
                    // InputProps={{
                    //     endAdornment: <InputAdornment position="end" style={{margin: "auto 0 15px"}}>
                    //         <div>
                    //             <Tooltip title="Preview HTML">
                    //                 <IconButton onClick={() => setPreviewFront(true)}>
                    //                     <VisibilityIcon color="secondary" />
                    //                 </IconButton>
                    //             </Tooltip>
                    //         </div>
                    //     </InputAdornment>,
                    // }}
                    multiline
                    rows={4}
                    />
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
                <Button type="submit" fullWidth style={{backgroundColor: front && back ? "green" : "grey", color: "white"}}>Submit</Button>
                </Grid>

            </Grid>
                </form>

        

      </Dialog>
    );
}

export default CreateCardDialog