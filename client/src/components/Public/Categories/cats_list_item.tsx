import React, { useEffect, useState } from 'react';
import { checkFile, addDefaultImg } from '../../../utils';
import { Category } from '../../../types';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

interface Props {
    cat: Category;
}

const CatItem: React.FC<Props> = ({ cat }) => {

    const [imgSrc, setImgSrc] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const request = await checkFile(`${cat._id}.jpg`, 'cat');
                if (request.result === true) {
                    setImgSrc(`${FS_PREFIX}/assets/media/cover_img_cat/${cat._id}.jpg`);
                } else {
                    setImgSrc(request.defaultPath);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [cat?._id]);

    return (
        <div className="cat_item_card">
            <div className="cat_item_img">
                    <img src={imgSrc} alt="category cover" onError={addDefaultImg} />
            </div>
            <div className="cat_item_text">
                <h2><b>{cat.title}</b><span>→</span></h2>
                {cat.description ? cat.description : null }<br />
            </div>
        </div>
    );
};

export default CatItem;