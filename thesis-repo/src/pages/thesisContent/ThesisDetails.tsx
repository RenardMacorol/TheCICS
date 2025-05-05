  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { supabase } from "../../service/supabase";
  import DashNavTop from '../../components/dashboard/DashNavTop';
  import FilterButton from "../../components/dashboard/FilterButton";
import { AddViewer } from "../../service/ContentManagement/AddThesisView";
import LoadingThesisDetails from "../../components/global/LoadingThesisDetails";

  type Author = {
    firstName: string;
    lastName: string;
  };

  type Thesis = {
    thesisID: number;
    authorID: number | null;
    title: string;
    abstract: string;
    publicationYear: number;
    keywords: string;
    pdfFileUrl: string;
    status: string;
    author?: Author | Author[];
    authorName?: string;
    views?: number;
    likes?: number;
  };

  type Comment = {
    commentID: number;
    thesisID: string;
    username: string;
    content: string;
    createdAt: string;
    Users: {
      name: string;
      email: string;
    } | null;
    
  };

  

  const ThesisDetails = () => {
    const { thesisID } = useParams();
    const [thesis, setThesis] = useState<Thesis | null>(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [likes, setLikes] = useState(0);
    const [isRestricted, setIsRestricted] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);



    useEffect(() => {
      const fetchThesisDetails = async () => {
        const { data, error } = await supabase
          .from("Thesis")
          .select(`
            thesisID, title, abstract, publicationYear, keywords, pdfFileUrl, status, authorID, 
            Author:authorID (firstName, lastName)
          `)
          .eq("thesisID", thesisID)
          .single();
    
        if (error) {
          console.error("Error fetching thesis details:", error);
        } else {
          const author = data.Author && Array.isArray(data.Author) ? data.Author[0] : data.Author;
          const thesis = ({
            ...data,
            authorName: author ? `${author.firstName} ${author.lastName}` : "Unknown Author",
          });
    
          const user = await supabase.auth.getUser();
          if (user.data.user?.id) {
            const count = await AddViewer(user.data.user.id, thesis.thesisID);
            setThesis({
              ...thesis,
              views: count ?? 0,
            });
          }
        }
        setLoading(false);
      };
    
      const fetchComments = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
    
        if (userError || !user) {
          console.error("User is not authenticated");
          return;
        }
    
        // Check if the user is restricted
        const { data: userInfo, error: userInfoError } = await supabase
          .from("Users")
          .select("name, commentRestricted")
          .eq("googleAuthID", user.id)
          .single();
    
        if (userInfoError || !userInfo) {
          console.error("Error fetching user info:", userInfoError?.message || "");
          return;
        }
    
        setIsRestricted(userInfo.commentRestricted !== "Active");
    
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("thesisID", thesisID)
          .order("createdAt", { ascending: false });
    
        if (error) {
          console.error("Error fetching comments:", error);
        } else {
          console.log("Fetched comments:", data);
          setComments(data);
        }
      };
    
      const loadLikes = async () => {
        // Fetch the count of likes sa table
        const { count, error: countError } = await supabase
          .from("like")
          .select("*", { count: "exact", head: true })
          .eq("thesisID", thesisID);
      
        if (!countError && count !== null) {
          setLikes(count); 
        }
      
        // Check if the current user has liked
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          const { count: userLikeCount, error: userLikeError } = await supabase
            .from("like")
            .select("*", { count: "exact", head: true })
            .eq("thesisID", thesisID)
            .eq("user_id", user.id);
      
          if (!userLikeError && userLikeCount !== null) {
            setHasLiked(userLikeCount > 0);
          }
        }
      };
      
    
      if (thesisID) {
        fetchThesisDetails();
        fetchComments();
        loadLikes(); 
      }
    }, [thesisID]);

    const handleLike = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
    
      if (error || !user) {
        console.error("User not authenticated");
        return;
      }
    
      if (!hasLiked) {
        const { error: likeError } = await supabase
          .from("like")
          .insert([{ thesisID: thesisID, user_id: user.id }]);
        
        if (likeError) {
          console.error("Error liking thesis:", likeError);
        } else {
          setLikes((prev) => prev + 1);
          setHasLiked(true);
        }
      } else {
        const {error: unlikeError} =await supabase.from("like").delete().eq("thesisID",thesisID).eq("user_id", user.id)
        if(unlikeError){
          console.log("unlike errro",error)
        }
          setLikes((prev) => Math.max(prev-1,0))
          setHasLiked(false)
          console.log("Unlike done succesfully")
      }
    };
    
    

    const handleCommentSubmit = async () => {
      if (isRestricted) {
        console.warn("You are restricted from commenting.");
        return;
      }
    
      if (!newComment.trim()) return;
    
      // Get the authenticated user's info
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
    
      if (userError || !user) {
        console.error("User is not authenticated:", userError?.message || "");
        return;
      }
    
      // Fetch the user's full name from the Users table
      const { data: userInfo, error: userInfoError } = await supabase
        .from("Users")
        .select("name")
        .eq("googleAuthID", user.id)
        .single();
    
      if (userInfoError || !userInfo) {
        console.error("Error fetching user name:", userInfoError?.message || "");
        return;
      }
    
      const { name } = userInfo;
    
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            thesisID,
            username: name, 
            content: newComment,
            userid: user.id,
            createdAt: new Date().toISOString(),
          },
        ])
        .select();
    
      if (error) {
        console.error("Error adding comment:", error.message || error);
      } else {
        setComments([data[0], ...comments]);
        setNewComment("");
      }
    };
    
    

    if (loading) return <div className="text-center"><LoadingThesisDetails /></div>;

    if (!thesis) return <div className="text-center p-10">Thesis not found.</div>;

    return (
      <div className="bg-gray-100 min-h-screen text-white">
        <DashNavTop setSearchQuery={() => { } } searchQuery={""} />
        <FilterButton />

        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-5 text-black">
          <h1 className="text-2xl font-bold mb-4">{thesis.title}</h1>
          <p className="text-gray-600">By: {thesis.authorName}</p>
          <p className="text-gray-500 text-sm">Published: {thesis.publicationYear}</p>
          <p className="text-gray-500 text-sm">Views: {thesis.views} | Likes: {likes}</p>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Abstract</h2>
            <p className="text-gray-700">{thesis.abstract}</p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Keywords</h2>
            <p className="text-gray-700">{thesis.keywords}</p>
          </div>

          <div className="mt-4">
            <a
              href={thesis.pdfFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              View PDF
            </a>
          </div>

          <button
            onClick={handleLike}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Like ❤️ ({likes})  
          </button> 

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Comments</h2>
            <div className="mt-2">
              {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.commentID} className="bg-gray-200 p-2 rounded-md my-2">
                    <p className="text-sm text-gray-600">
                    <strong>{comment.Users?.name || comment.username}</strong> • {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-gray-500 text-xs">
                      {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime()) 
                        ? new Date(comment.createdAt).toLocaleString("en-US", {
                            timeZone: "Asia/Manila",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                        : "No Date Available"}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4">
            {isRestricted ? (
              <p className="text-red-500 font-semibold">
                You are restricted from commenting on theses.
              </p>
            ) : (
              <>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={handleCommentSubmit}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Submit Comment
                </button>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    );
  };

  export default ThesisDetails;
