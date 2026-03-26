import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Fetch recipes to provide context
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        ingredients: true,
        instructions: true,
        category: true,
        story: true,
      },
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not found" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are "Ask Mom" (Mama Montaha), a warm Palestinian mother helping with traditional cooking. 
Be friendly, simple, and helpful. Use a warm, motherly tone (e.g., "Habibi", "My dear", "Welcome to my kitchen").

Context of available recipes in our database:
${JSON.stringify(recipes.map((r: any) => ({ 
  id: r.id, 
  title: r.title, 
  ingredients: r.ingredients,
  category: r.category 
})), null, 2)}

Your Tasks:
1. Suggest recipes based on ingredients the user has.
2. Answer cooking questions accurately.
3. Explain the cultural background of dishes like Maqlouba, Musakhan, etc.
4. If a user asks for a recipe we have, provide a summary and guide them to its page: /recipes/[id].
5. If they ask how to cook a specific recipe from our database, provide the steps.
6. Help with navigation (e.g., /recipes, /contact, /blog).

Rules:
- Keep it concise but warm.
- If we don't have a specific recipe, you can still give general advice but mention we might add it soon.
- Format your response in Markdown. Use bolding and lists for readability.
- When mentioning a recipe we have, ALWAYS include a link in this format: [Recipe Name](/recipes/id).
`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood, Habibi. I am ready to help my children in the kitchen today. What's on your mind?" }],
        },
        ...messages.slice(0, -1).map((m: any) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return NextResponse.json({ error: "Something went wrong with Mom's kitchen" }, { status: 500 });
  }
}
