export type Review = {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
  
  const db: Record<string, Review[]> = {
    '1': [
      { id: 'r1', userName: 'an@gmail.com', rating: 5, comment: 'Sách rất hay, đáng đọc.', createdAt: '2026-10-01' },
      { id: 'r2', userName: 'binh@gmail.com', rating: 4, comment: 'Nội dung tốt, giấy in đẹp.', createdAt: '2026-10-05' },
    ],
  };
  
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  
  export const reviewService = {
    getReviews: async (bookId: string): Promise<Review[]> => {
      await wait(500);
      return [...(db[bookId] ?? [])];
    },
  
    addReview: async (
      bookId: string,
      payload: { rating: number; comment: string; userName: string },
      token: string
    ): Promise<Review> => {
      await wait(700);
      const review: Review = {
        id: String(Date.now()),
        userName: payload.userName,
        rating: payload.rating,
        comment: payload.comment,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      db[bookId] = [review, ...(db[bookId] ?? [])];
      return review;
    },
  };