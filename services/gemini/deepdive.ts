
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { DeepTech, Source } from "../../types";
import { withRetry, getSearchConfig, getEnhancedSourcesFromResponse } from './shared';
import { getDeepDiveSystemInstruction, getDeepDiveSchema } from '../prompts';
import { responseQualityValidator, type QualityAssessment } from '../quality/responseValidator';
import { optimizedResponseValidator } from '../quality/optimizedValidator';


export type DeepDiveStreamEvent =
  | { type: 'sources'; sources: Source[] }
  | { type: 'status'; message: string }
  | { type: 'analysisChunk'; chunk: string }
  | { type: 'qualityAssessment'; assessment: QualityAssessment };

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
  yield { type: 'status', message: `🔍 "${tech.techName}" について Web調査を開始...` };
  
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
          systemInstruction: "あなたは優秀なリサーチアナリストです。指定された技術について、ウェブ検索を駆使して客観的な情報を収集し、要約してください。収集した情報は必ず日本語で整理してください。",
          ...getSearchConfig(),
      }
  }));

  const context = gatherResponse.text;
  const enhancedSources = getEnhancedSourcesFromResponse(gatherResponse);
  
  if (enhancedSources.sources.length > 0) {
    yield { type: 'status', message: `📚 ${enhancedSources.sources.length}件の信頼できる情報源を発見` };
    yield { type: 'sources', sources: enhancedSources.sources };
  }
  
  if (!context || context.trim().length < 50) {
      throw new Error("ウェブ検索から十分な情報を収集できませんでした。非常に新しい技術か、公開情報が少ない可能性があります。");
  }

  // STEP 2: Structure the gathered information into a JSON report
  yield { type: 'status', message: '🧠 収集した情報を分析し、VC評価レポートを生成中...' };

  const structurePrompt = `
以下のコンテキスト情報に厳密に基づいて、VC評価レポートを生成してください。

重要: 出力は必ず日本語で記述してください。英語での出力は一切禁止です。

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
          generationConfig: {
            temperature: 0.3,
            topP: 0.8,
            topK: 40,
          }
      }
  }));

  let fullAnalysisContent = '';
  let chunkCount = 0;
  
  for await (const chunk of stream) {
    const analysisChunk = chunk.text;
    if (analysisChunk) {
      fullAnalysisContent += analysisChunk;
      chunkCount++;
      
      // Provide dynamic status updates based on content
      if (chunkCount % 5 === 0) {
        const currentContent = fullAnalysisContent.toLowerCase();
        if (currentContent.includes('scorecard') && !currentContent.includes('summary')) {
          yield { type: 'status', message: '📊 投資スコアカードを生成中...' };
        } else if (currentContent.includes('summary') && !currentContent.includes('potentialimpact')) {
          yield { type: 'status', message: '📝 投資仮説サマリーを作成中...' };
        } else if (currentContent.includes('potentialimpact') && !currentContent.includes('marketrisk')) {
          yield { type: 'status', message: '💰 ポテンシャルインパクトを評価中...' };
        } else if (currentContent.includes('marketrisk') && !currentContent.includes('techrisk')) {
          yield { type: 'status', message: '📈 市場リスクを分析中...' };
        } else if (currentContent.includes('techrisk') && !currentContent.includes('keyflags')) {
          yield { type: 'status', message: '🔬 技術リスクを評価中...' };
        } else if (currentContent.includes('keyflags')) {
          yield { type: 'status', message: '🚩 重要な投資判断ポイントを整理中...' };
        }
      }
      
      yield { type: 'analysisChunk', chunk: analysisChunk };
    }
  }

  // STEP 3: Optimized Quality Assessment
  yield { type: 'status', message: '✅ 分析品質を評価し、信頼性スコアを算出中...' };
  
  try {
    // 最適化された品質評価システムを使用
    const qualityAssessment = await optimizedResponseValidator.assessTechAnalysisQuality(
      fullAnalysisContent,
      enhancedSources.sources,
      tech.techName
    );
    
    yield { type: 'qualityAssessment', assessment: qualityAssessment };
    
    // Log quality metrics for monitoring
    console.log(`Optimized Quality Assessment for ${tech.techName}:`, {
      overallScore: qualityAssessment.overallScore,
      confidence: qualityAssessment.confidence,
      sourceCount: enhancedSources.sources.length,
      sourceReliability: enhancedSources.qualityMetrics.averageReliability,
      processingOptimized: true
    });
    
  } catch (error) {
    console.warn('Optimized quality assessment failed, falling back to standard assessment:', error);
    
    // フォールバック: 標準の品質評価システムを使用
    try {
      const fallbackAssessment = responseQualityValidator.assessTechAnalysisQuality(
        fullAnalysisContent,
        enhancedSources.sources,
        tech.techName
      );
      yield { type: 'qualityAssessment', assessment: fallbackAssessment };
    } catch (fallbackError) {
      console.warn('Fallback quality assessment also failed:', fallbackError);
      // Continue without failing the entire analysis
    }
  }
}
