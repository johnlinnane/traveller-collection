export type Category = {
    _id: string,
    title: String,
    description?: String,
    catIsHidden?: Boolean
};

export type Item = ({
    _id: string,
    title: string,
    creator: string | null,
    subject?: string | null,
    description?: string | null,
    source?: string | null,
    date_created?: string | null,
    tags?: string[],
    contributor?: string | null,
    item_format?: string | null,
    materials?: string | null,
    physical_dimensions?: string | null,
    pages?: string | null,        
    editor?: string | null,
    publisher?: string | null,
    further_info?: string | null,
    language?: string | null,
    reference?: string | null,
    rights?: string | null,
    category_ref?: string | null,
    subcategory_ref?: string | null,
    external_link?: [
        {
            url?: string | null,
            text?: string
        }
    ],
    geo?: {
        address?: string | null,
        latitude?: string | null,
        longitude?: string | null
    },
    location?: string | null,

    is_pdf_chapter?: boolean | null,
    pdf_item_pages?: {
        start?: number | null,
        end?: number | null
    },
    pdf_item_parent_id?: string | null,

    shareDisabled?: boolean
});