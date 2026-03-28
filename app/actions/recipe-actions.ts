'use server';

import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function submitQuestion(recipeId: string, content: string, content_ar?: string, author: string = 'Anonymous') {
    if (!content.trim() && !content_ar?.trim()) return { error: 'Question cannot be empty' };
    try {
        await addDoc(collection(db, 'comments'), {
            content,
            content_ar,
            author,
            recipeId,
            createdAt: serverTimestamp(),
        });
        revalidatePath(`/recipes/${recipeId}`);
        return { success: true };
    } catch (error) {
        console.error('Error submitting question:', error);
        return { error: 'Failed to submit question' };
    }
}

export async function submitReply(commentId: string, content: string, recipeId: string, content_ar?: string, author: string = 'Mama Montaha') {
    if (!content.trim() && !content_ar?.trim()) return { error: 'Reply cannot be empty' };

    try {
        await addDoc(collection(db, `comments/${commentId}/replies`), {
            content,
            content_ar,
            author, // Defaulting to 'Mama Montaha' as per original
            createdAt: serverTimestamp(),
        });
        revalidatePath(`/recipes/${recipeId}`);
        return { success: true };
    } catch (error) {
        console.error('Error submitting reply:', error);
        return { error: 'Failed to submit reply' };
    }
}

export async function getQuestions(recipeId: string) {
    try {
        const q = query(
            collection(db, 'comments'),
            where('recipeId', '==', recipeId),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const comments = await Promise.all(querySnapshot.docs.map(async (commentDoc) => {
            const commentData = commentDoc.data();
            
            // Fetch replies for each comment
            const repliesQuery = query(
                collection(db, `comments/${commentDoc.id}/replies`),
                orderBy('createdAt', 'asc')
            );
            const repliesSnapshot = await getDocs(repliesQuery);
            const replies = repliesSnapshot.docs.map(replyDoc => ({
                id: replyDoc.id,
                ...replyDoc.data(),
                createdAt: (replyDoc.data().createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString()
            }));

            return {
                id: commentDoc.id,
                ...commentData,
                createdAt: (commentData.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
                replies
            };
        }));
        
        return comments;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}
