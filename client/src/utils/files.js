export const maxSelectFile = (event, _amount) => {
    let files = event.target.files;
    let amount = _amount ? _amount : 6;
    if (files.length > 6) { 
        alert('Only 6 images can be uploaded at a time');
        event.target.value = null;
        return false;
    }
    return true;
}

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
