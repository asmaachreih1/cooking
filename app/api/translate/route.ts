import { getTranslation } from "@/lib/translate-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const translatedText = await getTranslation(text, targetLang);
    return NextResponse.json({ translation: translatedText });
  } catch (error) {
    console.error("Translation Error:", error);
    return NextResponse.json({ error: "Failed to translate" }, { status: 500 });
  }
}
