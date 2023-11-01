import React, { useEffect, useState } from 'react';
import { checkFile, addDefaultImg } from '../../../utils';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const CatItem: React.FC = (props: any) => {

    const [imgSrc, setImgSrc] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await checkFile(`${props.cat._id}.jpg`, 'cat');
                if (request.result === true) {
                    setImgSrc(`${FS_PREFIX}/assets/media/cover_img_cat/${props.cat._id}.jpg`);
                } else {
                    setImgSrc(request.defaultPath);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [props.cat?._id]);

    return (
        <div className="cat_item_card">
            <div className="cat_item_img">
                    <img src={imgSrc} alt="category cover" onError={addDefaultImg} />
            </div>
            <div className="cat_item_text">
                <h2><b>{props.cat.title}</b><span>→</span></h2>
                {props.cat.description ? props.cat.description : null }<br />
            </div>
        </div>
    );
};

export default CatItem;