export interface SlideSlots {
    [key: string]: string | undefined;
    default: string;
}

export interface SlideMeta {
    layout?: string;
    id?: string;
    theme?: string;
    title?: string;
    background?: string;
    class?: string;
    clicks?: number;
    src?: string;
    slideNumber?: boolean | string;
    transition?: string;
    [key: string]: any;
}

export interface Slide {
    id: number;
    slug: string;
    meta: SlideMeta;
    content: string;
    slots: SlideSlots;
    notes: string;
    style?: Record<string, any>;
}
