import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

async function translateObject(obj, type) {
    console.log(`Translating ${type}: ${obj.title || obj.id}...`);
    
    let prompt = "";
    if (type === 'recipe') {
        prompt = `Translate the following recipe fields into Arabic. Return ONLY a JSON object with title, description, story, tips, ingredients (array), and instructions (array).
        Title: ${obj.title}
        Description: ${obj.description}
        Story: ${obj.story}
        Tips: ${obj.tips}
        Ingredients: ${JSON.stringify(obj.ingredients)}
        Instructions: ${JSON.stringify(obj.instructions)}`;
    } else {
        prompt = `Translate the following content fields into Arabic. Return ONLY a JSON object with title, excerpt, and content.
        Title: ${obj.title}
        Excerpt: ${obj.excerpt}
        Content: ${obj.content}`;
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error(`Translation failed for ${obj.title}:`, error);
        return null;
    }
}

async function main() {
    const dataPath = path.join(process.cwd(), 'scripts', 'data', 'seed-data.json');
    if (!fs.existsSync(dataPath)) {
        console.error("No seed-data.json found. Run dump.mjs first.");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const bilingualData = { recipes: [], blogs: [], news: [] };

    // Process Recipes
    for (const recipe of data.recipes) {
        if (!recipe.title_ar) {
            const tr = await translateObject(recipe, 'recipe');
            if (tr) {
                recipe.title_ar = tr.title;
                recipe.description_ar = tr.description;
                recipe.story_ar = tr.story;
                recipe.tips_ar = tr.tips;
                recipe.ingredients_ar = tr.ingredients;
                recipe.instructions_ar = tr.instructions;
            }
        }
        bilingualData.recipes.push(recipe);
    }

    // Process Blogs
    for (const blog of data.blogs) {
        if (!blog.title_ar) {
            const tr = await translateObject(blog, 'blog');
            if (tr) {
                blog.title_ar = tr.title;
                blog.excerpt_ar = tr.excerpt;
                blog.content_ar = tr.content;
            }
        }
        bilingualData.blogs.push(blog);
    }

    // Process News
    for (const newsItem of data.news) {
        if (!newsItem.title_ar) {
            const tr = await translateObject(newsItem, 'news');
            if (tr) {
                newsItem.title_ar = tr.title;
                newsItem.excerpt_ar = tr.excerpt;
                newsItem.content_ar = tr.content;
            }
        }
        bilingualData.news.push(newsItem);
    }

    fs.writeFileSync(
        path.join(process.cwd(), 'scripts', 'data', 'seed-data-bilingual.json'),
        JSON.stringify(bilingualData, null, 2)
    );

    console.log("Bilingual data generated successfully!");
}

main();
