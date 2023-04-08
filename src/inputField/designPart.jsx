import { useState } from 'react';
import "./design.css";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slider from "@mui/material/Slider";
import Input from '@mui/material/Input';
import TableWithInfiniteScroll from '../logicField/table';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

export const DesignPart = () => {
    const [err, setErr] = useState(0);
    const [seed, setSeed] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('EN');

    const handleSliderChange = ({target}) => setErr(target.value);
    
    const handleInputChange = ({target}) => setErr(target.value === '' ? '' : Number(target.value));
    const handleLanguage = ({target}) => setSelectedLanguage(target.value);

    const handleBlur = () => setErr(!(err < 0) ? err > 1000 ? 1000 : err : 0);
  
    return (
        <div className="designPart">
            <AppBar>
                <Toolbar>
                    <Typography>
                        FAKE USER DATA GENERATOR
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className='userInput'>
                <div className='langPart'>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <Select
                            value={selectedLanguage}
                            onChange={handleLanguage}
                            inputProps={{ 'aria-label': 'Without label' }}>
                            <MenuItem value={"EN"}>EN</MenuItem>
                            <MenuItem value={"RU"}>RU</MenuItem>
                            <MenuItem value={"FR"}>FR</MenuItem>
                        </Select>
                    </FormControl>
                    <h4 style={{ fontWeight: '400' }}>Target Language: {selectedLanguage.toUpperCase()}</h4>
                </div>
                <div className='sliderPart'>
                    <FormLabel>Errors Per Record: </FormLabel>
                    <Input
                        value={err}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 1,
                            min: 0,
                            max: 1000,
                            type: 'number',
                            'aria-labelledby': 'input-slider' }} />
                    <Slider
                        value={typeof err === 'number' ? err : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        step={0.5}
                        min={0}
                        max={10} />
                </div>
                <div className='randomSeedPart'>
                    <TextField 
                        label="Random Seed" 
                        variant="filled" 
                        color="success"
                        value={seed}
                        onChange={({target}) => setSeed(target.value)} />
                </div>
            </div>
            <TableWithInfiniteScroll langProp={selectedLanguage} errProp={err} ranProp={seed}/>
        </div>
    );
}
