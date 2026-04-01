import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeIdea(idea: string, city: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Analyze this startup idea for the Indian market. Idea: ${idea}. Target City: ${city}. Provide deep market research including TAM/SAM/SOM, current trends, barriers to entry, regulatory landscape in India, and specific customer pain points.`,
    config: {
      systemInstruction: "You are an expert startup analyst for the Indian market. Return valid JSON only.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          startupName: { type: Type.STRING },
          oneLiner: { type: Type.STRING },
          marketSize: { type: Type.STRING },
          marketGrowth: { type: Type.STRING },
          tamSamSom: {
            type: Type.OBJECT,
            properties: {
              tam: { type: Type.STRING },
              sam: { type: Type.STRING },
              som: { type: Type.STRING }
            }
          },
          marketTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
          barriersToEntry: { type: Type.ARRAY, items: { type: Type.STRING } },
          regulatoryLandscape: { type: Type.STRING },
          customerPainPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunityScore: { type: Type.NUMBER },
          targetCustomer: { type: Type.STRING },
          revenueModel: { type: Type.STRING },
          fundingStage: { type: Type.STRING },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                weakness: { type: Type.STRING }
              }
            }
          },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          pitchSlides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.NUMBER },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                speakerNotes: { type: Type.STRING },
                emoji: { type: Type.STRING },
                layoutType: { type: Type.STRING }
              }
            }
          },
          investorEmail: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              body: { type: Type.STRING }
            }
          }
        },
        required: ["startupName", "oneLiner", "marketSize", "marketGrowth", "opportunityScore", "competitors", "swot", "pitchSlides", "investorEmail"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generatePPTContent(prompt: string, count: number, theme: string, lang: string) {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Create a ${count}-slide presentation. Request: ${prompt}. Theme: ${theme}. Language: ${lang}.`,
    config: {
      systemInstruction: "Create a startup pitch deck. Return valid JSON only.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          presentationTitle: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          theme: {
            type: Type.OBJECT,
            properties: {
              bgColor: { type: Type.STRING },
              titleColor: { type: Type.STRING },
              textColor: { type: Type.STRING },
              accentColor: { type: Type.STRING },
              cardBg: { type: Type.STRING }
            }
          },
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                slideNumber: { type: Type.NUMBER },
                layoutType: { type: Type.STRING },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                content: { type: Type.STRING },
                bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                stats: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      value: { type: Type.STRING },
                      label: { type: Type.STRING }
                    }
                  }
                },
                speakerNotes: { type: Type.STRING },
                emoji: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
