import { GoogleGenAI, Type } from "@google/genai";
import { Book, EvaluationResult } from '../types';

export const evaluateEssay = async (book: Book, essay: string): Promise<EvaluationResult> => {
  if (!essay || essay.trim().length < 20) {
    return { score: 0, feedback: "المقال قصير جداً للتقييم الموضوعي." };
  }

  // Fix: Initialize GoogleGenAI strictly using process.env.API_KEY as per the @google/genai guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    أنت مقيم أدبي محترف في مبادرة "حياة كريمة". 
    مهمتك هي تقييم ملخص أو رسالة كتبها مشارك عن كتاب "${book}".
    يجب أن تعطي درجة من 50 بناءً على (الفهم، الأسلوب، عمق التحليل).
    ويجب أن تقدم ملاحظات نوعية (AI Notes) للمشارك.
    الرد يجب أن يكون بتنسيق JSON حصراً.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بتقييم النص التالي: "${essay}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { 
                type: Type.NUMBER, 
                description: "الدرجة المستحقة من 50" 
            },
            feedback: { 
                type: Type.STRING, 
                description: "ملاحظات الذكاء الاصطناعي النوعية" 
            }
          },
          required: ["score", "feedback"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      score: result.score || 0,
      feedback: result.feedback || "لم يتم توفير تقييم مفصل."
    };
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return { score: 0, feedback: "حدث خطأ أثناء التقييم الآلي." };
  }
};