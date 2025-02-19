import { useState } from "react";

const ContentList = () => {
    const [items] = useState([
        {id:1, text:"Same things content here"},
        {id:2, text:"Cool things content here"},
        {id:3, text:"Thesis Content things content here"},
    ]);
    return(
        <div className="px-6 space-y-4">
            {items.map((item) => (
                <div key={item.id} className="flex bg-white p-4 rounded-lg shadow-md">
                    {/*Image Placeholder */}
                    <div className="w-32 h-24 bg-gray-300 flex items-center justify-center">📷</div>
                        
                    
                    {/*Text Content */}
                    <div className="flex-1 px-4">
                    <p className="text-gray-700">{item.text}</p>
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