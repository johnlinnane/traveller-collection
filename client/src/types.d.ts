export type User = {
    email: string,
    password: string,
    name?: string,
    lastname?: string,
    role?: number,
    token?: string
}

export type Item = {
    _id: string,
    title: string,
    creator?: string | null,
    subject?: string | null,
    location?: string | null,
    description?: string | null,
    source?: string | null,
    date_created?: string | null,
    tags?: [
        {
            value: string,
            label: string
        }
    ]
    contributor?: string | null,
    ownerId?: string | null,
    category_ref?: string[] | null,
    subcategory_ref?: string[] | null,
    
    item_format?: string | null,
    materials?: string | null,
    physical_dimensions?: string | null,
    pages?: string | null,        
    
    editor?: string | null,
    publisher?: string | null,
    further_info?: string | null,
    
    external_link?: {
        url?: string | null;
        text?: string | null;
    }[];

    is_link?: boolean,

    language?: string | null,
    reference?: string | null,
    rights?: string | null,
    
    image?: [
        {
            url: string,
            text: string
        }
    ],

    date_added?: string,
    date_modified?: string,
    number_files?: number,
    
    geo?: {
        address?: string | null,
        latitude?: number | null,
        longitude?: number | null
    },
    
    has_chapter_children?: boolean,
    pdf_page_index?: ({
        page?: number;
        heading?: string;
        description?: string;
        has_child?: boolean;
        child_id?: string;
    })[];
    
    is_pdf_chapter?: boolean | null,
    pdf_item_parent_id?: string | null,
    pdf_item_pages?: {
        start?: number | null,
        end?: number | null
    },

    shareDisabled?: boolean,
    isPending?: boolean | null
};

export type Category = {
    _id: string,
    title: string,
    description?: string,
    catIsHidden?: boolean
};

export type SubCategory = {
    _id?: string;
    title?: string;
    description: string,
    parent_cat: string,
    cover_item?: number,
    subCatIsHidden?: boolean
}

export type Intro = {
    title: string,
    body: string
}

export type Info = {
    sections : {
        item_id : string,
        heading : string,
        paragraph : string
    }[],
    iconsCaption?: string
}

export type NavInfo = {
    catTitle?: string | null,
    catId?: string | null,
    subCatTitle?: string | null,
    subCatId?: string | null,
    type?: string | null
}

