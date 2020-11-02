import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useForm from '../hooks/useForm';
import { Box, Button, Container, InputAdornment, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core'
import Header from '../components/Header';
import { goToOrder, goToOrdersList } from '../router/coordinator';
import { useHistory } from 'react-router-dom';
import { style } from './styles';

const useStyles = makeStyles((theme) => ({
    form:{
        display: 'flex',
        flexDirection: 'column',
    },
    submit: {
        marginTop: theme.spacing(2),
        borderRadius: '34px'
    }
}));

const CreateOrders = () => {
    const classes = useStyles();
    const history = useHistory();

    const [projectList, setProjectList] = useState([])
    const [form, onChangeInput] = useForm({
        qnt: '',
        price: '',
        orderDate: '',
        project: ''
    })

    useEffect(() => {
        axios.get('http://localhost:3004/projects')
        .then((response) => {
            setProjectList(response.data)
        })
    }, [])

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onChangeInput(name, value)
    }

    const createOrder = (event) => {
        event.preventDefault()
        const body = {
            id: Date.now(),
            qnt: form.qnt,
            price: form.price,
            date: form.orderDate,
            project: form.project,
            status: 'under_approval'
        }
        axios.post('http://localhost:3004/orders', body)
        .then((response) => 
            goToOrder(history, body.id)
        )
        .catch(err => console.log(err))
    }

    return ( 
        <Container maxWidth="sm">
            <Header text={'início'} initial={true}/>
            <Box style={style}>
                <Typography variant="h5" gutterBottom>nova ordem de compra</Typography>
                <form className={classes.form} onSubmit={createOrder}>
                    <TextField
                        name="qnt"
                        label="Quantidade de créditos"
                        variant="filled"
                        color="secondary"
                        type="number"
                        margin="normal"
                        placeholder="10"
                        value={form.qnt}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                    <TextField
                        name="price"
                        label="Preço (em dólares)"
                        variant="filled"
                        color="secondary"
                        type="number"
                        margin="normal"
                        placeholder="10"
                        value={form.price}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment:
                                <InputAdornment position="start">$</InputAdornment>
                        }}
                        required
                    />
                    <TextField
                        name="orderDate"
                        label="Data da compra"
                        variant="filled"
                        color="secondary"
                        type="date"
                        margin="normal"
                        value={form.orderDate}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true
                        }}
                        required
                    />
                    <TextField
                        name="project"
                        label="Projeto"
                        variant="filled"
                        color="secondary"
                        select={true}
                        margin="normal"
                        value={form.project}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true
                        }}
                        required    
                    >
                        {projectList.map(project => {
                            return <MenuItem value={project} key={project}>{project}</MenuItem>
                        })}
                    </TextField>
                    <Button className={classes.submit} variant="contained" color="primary" disableElevation type="submit">
                        criar ordem
                    </Button>                
                </form>
                <Button fullWidth className={classes.submit} variant="contained" color="secondary" disableElevation onClick={() => goToOrdersList(history)}>
                    ver todas
                </Button>                
            </Box>
        </Container>
     );
}
 
export default CreateOrders;
