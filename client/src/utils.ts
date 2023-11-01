import axios from 'axios';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

export const checkMimeType = (event, _types) => {
    let files = event.target.files 
    const types = _types ? _types : ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
    for(let x = 0; x < files.length; x++) {
        if (types.every(type => files[x].type !== type)) {
            alert(files[x].type + ' is not a supported format\n');
            return false;
        }
    };
    return true;
}

export const checkFileSize = (event, _size) => {
    let files = event.target.files;
    let size = _size ? _size : 400 * 1000;
    for(let x = 0; x < files.length; x++) {
        if (files[x].size > size) {
            alert(files[x].name + ' is too large, please pick a smaller file\n');
            return false;
        }
    };
    return true;
}    

export const maxSelectFile = (event, _amount: number) => {
    let files = event.target.files;
    let amount: number = _amount ? _amount : 6;
    if (files.length > amount) { 
        alert(`Only ${amount} images can be uploaded at a time`);
        event.target.value = null;
        return false;
    }
    return true;
}

export async function checkFile(fileName: string, type: string) {
    const body = { type, fileName }
    try {
        const response = await axios.post(`${API_PREFIX}/file-check`, body);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const addDefaultImg = (ev) => {
    const newImg = '/assets/media/default/default.jpg';
    if (ev.target.src !== newImg) {
        ev.target.src = newImg
    }  
} 



