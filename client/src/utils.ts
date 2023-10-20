import { toast } from 'react-toastify';


export const checkMimeType = (event, types) => {
    // typical types argument: ['image/png', 'image/jpeg', 'image/gif'];
    let files = event.target.files 
    let err = ''
    const mimeTypes = types;
    for(let x = 0; x<files.length; x++) {
        if (mimeTypes.every(type => files[x].type !== type)) {
            err += files[x].type+' is not a supported format\n';
        }
    };
    for(let z = 0; z<err.length; z++) { 
        event.target.value = null 
        toast.error(err[z])
    }
    return true;
}



export const checkFileSize = (event, maxFileSize) => {
    let files = event.target.files
    let size = maxFileSize; 
    let err = ""; 
    for(let x = 0; x<files.length; x++) {
        if (files[x].size > size) {
            err += files[x].type+'is too large, please pick a smaller file\n';
        }
    };
    for(let z = 0; z<err.length; z++) {
        toast.error(err[z])
        event.target.value = null
    }
    return true;
}    

export const maxSelectFile = (event, maxNumberFiles) => {
    let files = event.target.files;
    if (files.length > maxNumberFiles) { 
        event.target.value = null;
        return false;
    }
    return true;
}
   