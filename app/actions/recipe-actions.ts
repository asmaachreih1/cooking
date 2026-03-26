'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitQuestion(recipeId: string, content: string, author: string = 'Anonymous') {
    if (!content.trim()) return { error: 'Question cannot be empty' };

    try {
        await prisma.comment.create({
            data: {
                content,
                author,
                recipeId,
            },
        });
        revalidatePath(`/recipes/${recipeId}`);
        return { success: true };
    } catch (error) {
        console.error('Error submitting question:', error);
        return { error: 'Failed to submit question' };
    }
}

export async function submitReply(commentId: string, content: string, recipeId: string, author: string = 'Mama Montaha') {
    if (!content.trim()) return { error: 'Reply cannot be empty' };

    try {
        await prisma.reply.create({
            data: {
                content,
                author,
                commentId,
            },
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
        const comments = await prisma.comment.findMany({
            where: { recipeId },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return comments;
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}
