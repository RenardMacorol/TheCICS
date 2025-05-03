import { useEffect, useState } from "react";
import { CommentRecord } from "../../service/Types/CommentRecord";
import { supabase } from "../../service/supabase";

const ThesisCommentsModeration = () =>{
   const [comments, setComments] = useState<CommentRecord[]>([]);
   const [loadingComments, setLoadingComments] = useState(false);

   const fetchComments = async () => {
     setLoadingComments(true);
     const { data, error } = await supabase
       .from("comments")
       .select(
         `
        commentID,
        userid,
        thesisID,
        content,
        createdAt,
        Users (name, commentRestricted)
      `
       )
       .order("createdAt", { ascending: false });

     if (error) {
       console.error("Error fetching comments:", error.message);
     } else if (data) {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const normalized: CommentRecord[] = data.map((item: any) => ({
         commentID: item.commentID,
         userID: item.userid,
         thesisID: item.thesisID,
         userName: item.Users.name,
         content: item.content,
         createdAt: item.createdAt,
         Users: {
           name: item.Users.name,
           commentRestricted:
             item.Users.commentRestricted === "Restricted"
               ? "Restricted"
               : "Active",
         },
       }));
       setComments(normalized);
     }
     setLoadingComments(false);
   };

   useEffect(() => {
     fetchComments();
   }, []);

   const toggleRestriction = async (row: CommentRecord) => {
     const newStatus =
       row.Users.commentRestricted === "Restricted" ? "Active" : "Restricted";

     const { error } = await supabase
       .from("Users")
       .update({ commentRestricted: newStatus })
       .eq("userID", row.userID);

     if (error) {
       console.error("Error updating comment restriction:", error.message);
     } else {
       await fetchComments();
     }
   };

 
    return (
      <>
        <h2 className="text-xl font-semibold mb-4">🛡️ Comment Moderation</h2>
        {loadingComments ? (
          <p>Loading comments...</p>
        ) : (
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Comment</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Thesis ID</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.commentID} className="border-t">
                  <td className="px-4 py-2">{comment.content}</td>
                  <td className="px-4 py-2">{comment.Users?.name}</td>
                  <td className="px-4 py-2">{comment.thesisID}</td>
                  <td className="px-4 py-2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {comment.Users?.commentRestricted === "Restricted" ? (
                      <span className="text-red-600 font-semibold">
                        Restricted
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Allowed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`px-3 py-1 rounded ${
                        comment.Users?.commentRestricted === "Restricted"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                      onClick={() => toggleRestriction(comment)}
                    >
                      {comment.Users?.commentRestricted === "Restricted"
                        ? "Unrestrict"
                        : "Restrict"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
}

export default ThesisCommentsModeration;