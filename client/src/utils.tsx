import { toast } from 'react-toastify';


export const checkMimeType = (event, types) =>{
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
} // ['image/png', 'image/jpeg', 'image/gif'];
   