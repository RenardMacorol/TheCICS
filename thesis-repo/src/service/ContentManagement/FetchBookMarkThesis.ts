import { ThesisBase } from "../Class/ThesisBase";
import { supabase } from "../supabase";
import { Fetchable } from "../Types/Fetchable";
import Thesis from '../Types/Thesis';
import { countCommentByThesisID } from "./FetchCountComment";
import { CountViewByThesisID } from "./FetchCountView";
import { CountLikeByThesisID } from "./FetchCountLikes"; 

export class FetchBookmarkThesis extends ThesisBase implements Fetchable<Thesis> {
  private bookmarkIds: string[]; // or number[], depending on your data

  constructor(bookmarkIds: string[]) {
    super();
    this.bookmarkIds = bookmarkIds;
  }

  async fetch(): Promise<Thesis[]> {
    const { data: thesesData, error: thesesError } = await supabase
      .from("Thesis")
      .select("*")
      .in("thesisID", this.bookmarkIds)
      .eq("status", "Active");

    if (thesesError) {
      console.error("Error fetching theses:", thesesError);
      return [];
    }

    const counterComment = new countCommentByThesisID();
    const counterView = new CountViewByThesisID();
    const counterLike = new CountLikeByThesisID();

    const thesesCountStats = await Promise.all(
      thesesData.map(async (thesis) => {
        const commentCount = await counterComment.fetchCount(thesis.thesisID);
        const viewCount = await counterView.fetchCount(thesis.thesisID);
        const likeCount = await counterLike.fetchCount(thesis.thesisID);
        return {
          ...thesis,
          comments: commentCount ?? 0,
          views: viewCount ?? 0,
          likes: likeCount ?? 0,
        };
      })
    );

    this._thesis = thesesCountStats;

    console.log("Filtered Fetched Theses with Comments:", this._thesis);
    return this._thesis;
  }
}
