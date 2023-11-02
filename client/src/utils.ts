import axios from 'axios';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

const mimes = {
    image: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp'],
    pdf: ['application/pdf', 'application/x-pdf', 'application/acrobat', 'applications/vnd.pdf', 'text/pdf', 'text/x-pdf'],
    video: ['video/mp4'] // 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-flv', 'video/3gpp', 'video/3gpp2', 'video/x-matroska'
}

export const checkMimeType = (event, _types: string[]) => {
    let files = event.target.files;

    const check = (types: string[], msg: string | null) => {
        for(let x = 0; x < files.length; x++) {
            if (types.every(type => files[x].type !== type)) {
                alert(`${files[x].type} is not a supported format.\n${msg || ''}`);
                return false;
            }
        };
    }

    for (let type of _types) {
        switch (type) {
            case 'image':
                check(mimes.image, null)
                break;
            case 'pdf':
                check(mimes.pdf, null);
                break;
            case 'video':
                check(mimes.video, 'Please upload in MP4 format.');
                break;
            case 'all':
                const allMimes: string[] = ([] as string[]).concat(...Object.values(mimes));
                check(allMimes, null);
                break;
        }
    }

    return true;
}

export const checkFileSize = (event) => {

    
    let files = event.target.files;
    for(let x = 0; x < files.length; x++) {

        if (mimes.image.includes(files[x].type)) {
            if (files[x].size > 20000000) { // 20 MB
                alert(files[x].name + ' is too large, please pick a smaller file\n');
                return false;
            }
        }

        if (mimes.pdf.includes(files[x].type)) {
            if (files[x].size > 20000000) { // 20 MB
                alert(files[x].name + ' is too large, please pick a smaller file\n');
                return false;
            }
        }

        if (mimes.video.includes(files[x].type)) {
            if (files[x].size > 500000000) { // 500 MB
                alert(files[x].name + ' is too large, please pick a smaller file\n');
                return false;
            }
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



