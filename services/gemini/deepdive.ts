
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { DeepTech, Source } from "../../types";
import { withRetry, getSearchConfig, getSourcesFromResponse } from './shared';
import { getDeepDiveSystemInstruction, getDeepDiveSchema } from '../prompts';


export type DeepDiveStreamEvent =
  | { type: 'sources'; sources: Source[] }
  | { type: 'status'; message: string }
  | { type: 'analysisChunk'; chunk: string };

/**
 * Executes a two-step deep dive analysis:
 * 1. Gather Info: Uses Google Search to collect context about the technology.
 * 2. Structure Data: Feeds the context into a second call to get a structured JSON response.
 * This function streams events to update the UI on its progress.
 * 
 * @param ai - The GoogleGenAI client instance.
 * @param tech - The technology to analyze.
 * @returns An async generator yielding DeepDiveStreamEvent objects.
 */
export async function* streamDeepDiveAnalysis(
  ai: GoogleGenAI,
  tech: Pick<DeepTech, 'techName' | 'university'>
): AsyncGenerator<DeepDiveStreamEvent> {
  
  // STEP 1: Gather information using Google Search
  yield { type: 'status', message: 'Web調査による情報収集を開始...' };
  
  const gatherPrompt = `
以下の技術について、VC（ベンチャーキャピタリスト）が投資評価を行うために必要な情報を、ウェブから包括的に収集・要約してください。
特に、技術のユニークさ、市場性、競合、研究開発の進捗、潜在的なリスクなどに焦点を当ててください。

- **技術名**: ${tech.techName}
- **所属大学**: ${tech.university}
`;

  const gatherResponse: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: gatherPrompt,
      config: {
          systemInstruction: "あなたは優秀なリサーチアナリストです。指定された技術について、ウェブ検索を駆使して客観的な情報を収集し、要約してください。",
          ...getSearchConfig(),
      }
  }));

  const context = gatherResponse.text;
  const sources = getSourcesFromResponse(gatherResponse);
  
  if (sources.length > 0) {
    yield { type: 'sources', sources };
  }
  
  if (!context || context.trim().length < 50) {
      throw new Error("ウェブ検索から十分な情報を収集できませんでした。非常に新しい技術か、公開情報が少ない可能性があります。");
  }

  // STEP 2: Structure the gathered information into a JSON report
  yield { type: 'status', message: '収集した情報を基に、VC視点での評価レポートを生成中...' };

  const structurePrompt = `
以下のコンテキスト情報に厳密に基づいて、VC評価レポートを生成してください。

--- CONTEXT ---
${context}
--- END CONTEXT ---
`;

  const stream: AsyncGenerator<GenerateContentResponse> = await withRetry(() => ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: structurePrompt,
      config: {
          systemInstruction: getDeepDiveSystemInstruction(),
          responseMimeType: "application/json",
          responseSchema: getDeepDiveSchema(),
      }
  }));

  for await (const chunk of stream) {
    const analysisChunk = chunk.text;
    if (analysisChunk) {
      yield { type: 'analysisChunk', chunk: analysisChunk };
    }
  }
}
