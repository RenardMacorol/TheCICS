interface Thesis{
    thesisID: string;
    authorID: number;
    title: string;
    abstract: string;
    publicationYear: number;
    keywords: string;
    pdfFileUrl: string;
    status: string;
    authorName?: string;
    views?: number;
    likes?: number;
    comments?: number;
    keywordMatch?: number;
    githubURL?: string;
}

export default Thesis;