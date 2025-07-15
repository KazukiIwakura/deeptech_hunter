import type { AiStep, DeepTech } from '../types';

export const getStaticSearchSteps = (query: string): AiStep[] => [
    { 
        id: '1_explain', 
        type: 'explanation',
        title: '1. 技術概要の理解', 
        status: 'pending', 
        description: `まず「${query}」の基本原理、重要性、将来性を解説するための情報を集めます。`
    },
    { 
        id: '2_domestic', 
        type: 'domestic',
        title: '2. 国内の研究シーズ探索', 
        status: 'pending', 
        description: `Google検索で「${query} 大学 研究 日本」などのクエリを使い、国内大学の技術を探索します。`
    },
    { 
        id: '3_overseas', 
        type: 'overseas',
        title: '3. 海外の市場動向調査', 
        status: 'pending', 
        description: `「${query} startups」などで、先行する海外企業の資金調達状況や事業内容を調査します。`
    },
    { 
        id: '4_synthesis', 
        type: 'synthesis',
        title: '4. 情報の統合とレポート生成', 
        status: 'pending', 
        description: '収集した全ての情報を統合し、多角的な視点からサマリーレポートを作成します。'
    },
];

export const getStaticSearchMoreSteps = (): AiStep[] => [
    { 
        id: 'more-domestic', 
        type: 'more-domestic', 
        title: '国内技術の追加調査', 
        status: 'pending', 
        description: '既存の結果を除外し、異なるキーワードで未発見の国内大学技術をさらに探索します。'
    },
    { 
        id: 'more-overseas', 
        type: 'more-overseas', 
        title: '海外スタートアップの追加調査', 
        status: 'pending', 
        description: 'まだリストにない海外注目スタートアップを、別の切り口から調査します。'
    },
];

export const getStaticDeepDiveSteps = (tech: DeepTech): AiStep[] => [
    {
        id: 'deep-dive-1-query',
        type: 'deep-dive',
        title: '1. 初期クエリの生成',
        status: 'pending',
        description: `「${tech.techName}」の分析のため、Geminiが検索クエリを生成します。`
    },
    {
        id: 'deep-dive-2-research',
        type: 'deep-dive',
        title: '2. Web調査',
        status: 'pending',
        description: '生成されたクエリに基づき、Google Searchを用いて関連情報を収集します。'
    },
    {
        id: 'deep-dive-3-reflect',
        type: 'deep-dive',
        title: '3. 振り返りと知識ギャップ分析',
        status: 'pending',
        description: '検索結果を分析し、情報の不足や知識のギャップがないかAIが判断します。'
    },
    {
        id: 'deep-dive-4-refine',
        type: 'deep-dive',
        title: '4. 反復的な改善',
        status: 'pending',
        description: '必要に応じて追加の検索を行い、情報の精度と網羅性を高めます。'
    },
    {
        id: 'deep-dive-5-finalize',
        type: 'deep-dive',
        title: '5. 回答の最終化',
        status: 'pending',
        description: '収集・分析した全ての情報を統合し、VC評価レポートを生成します。'
    },
];
