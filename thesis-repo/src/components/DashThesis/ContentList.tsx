import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";

type Thesis = {
    thesisID: string;
    title: string;
    abstract: string;
    publicationYear: number;
    keywords: string;
    pdfFileUrl: string;
    status: string;
    author: {
        authorID: string;
        firstName: string;
        lastName: string;
    }
}

const ContentList = () => {
    const [items, setItems] = useState<Thesis[]>([]);

    useEffect(() => {
        const fetchTheses = async () => {
            const { data, error } = await supabase
                .from("Thesis")
                .select("*")

            if (error) {
                console.error("Error fetching theses:", error);
            } else {
                console.log("I Fetched thse: ", data)
                setItems(data);
            }
        };

        fetchTheses();
    }, []); 
    
    return(
        <div className="px-6 space-y-4">
            {items.map((item) => (
                <div key={item.thesisID} className="flex bg-white p-4 rounded-lg shadow-md">
                    {/*Image Placeholder */}
                    <div className="w-32 h-24 bg-gray-300 flex items-center justify-center">📷</div>
                        
                    
                    {/*Text Content */}
                    <div className="flex-1 px-4">
                    <p className="text-gray-700 font-semibold">{item.title}</p>
                    <p className="text-gray-700 font-bold">Keywords:</p>
                    <p className="text-gray-700 font-semibold">{item.keywords}</p>
                    <p className="text-gray-700 font-bold">Author:</p>
                    <p className="text-gray-700 font-semibold">{item.authorID}</p>
                    <p className="text-gray-700 font-light">{item.abstract}</p>
                    </div>

                    {/*Buttons */}
                    <div className="flex flex-col gap-2">
                    <button className="bg-blue-100 rounded-2xl border px-2 py-1 hover:bg-blue-400" >GitHub?</button>
                    <button className="bg-blue-100 rounded-2xl border px-2 py-1 hover:bg-blue-400" >Text</button>
                    </div>
                </div>
            )
        )}
        </div>

    )
}

export default ContentList;