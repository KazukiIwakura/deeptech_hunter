
import type { DeepTech, Source, OverseasStartup, TechExplanationData, DeepDiveAnalysisData } from '../types';
import type { Chat, GenerateContentResponse } from "@google/genai";
import type { DeepDiveStreamEvent } from './gemini/deepdive';


// For DiscoveryZone
export const mockDiscoverySuggestions: string[] = [
    "液体バイオプシー",
    "量子ドットディスプレイ",
    "核融合エネルギー",
    "全ゲノムシーケンス",
    "人工光合成",
    "脳マシンインターフェース",
    "マイクロ流体デバイス",
    "スマートダスト",
    "細胞農業 (Cellular Agriculture)",
    "メタマテリアル"
];

// For ResultsDisplay (streamHuntDeepTech)
export const mockDeepTechResults: DeepTech[] = [
    {
        id: 'mock-tech-1',
        techName: "ペロブスカイト太陽電池の高効率・高耐久化",
        university: "東京大学",
        summary: "次世代太陽電池の本命。独自の添加剤と封止技術により、変換効率25%以上と10年以上の期待寿命を両立する研究。軽量で柔軟なため、設置場所を選ばない。",
        potentialApplications: ["ビル壁面・窓ガラス発電", "自動車のボディ", "ウェアラブルデバイス", "宇宙利用"],
        researchLab: "先端科学技術研究センター 宮坂研究室",
        uniqueness: "鉛の使用量を削減しつつ、性能を維持する新組成を開発。インクジェット印刷による低コスト製造プロセスも確立。",
        potentialImpact: 'High',
        marketRisk: 'Medium',
        techRisk: 'High',
    },
    {
        id: 'mock-tech-2',
        techName: "iPS細胞由来の心筋細胞シート",
        university: "京都大学",
        summary: "重度の心不全患者向けに、iPS細胞から作製した心筋細胞をシート状にして心臓に移植する再生医療技術。心臓機能の回復が期待される。",
        potentialApplications: ["虚血性心疾患治療", "心筋梗塞後の再生", "創薬スクリーニング"],
        researchLab: "iPS細胞研究所 (CiRA)",
        uniqueness: "細胞の品質を均一化する培養技術と、生着率を高める移植手法が強み。既に臨床研究が進行中。",
        potentialImpact: 'High',
        marketRisk: 'High',
        techRisk: 'Medium',
    },
    {
        id: 'mock-tech-3',
        techName: "アンモニアを燃料とする固体酸化物形燃料電池 (SOFC)",
        university: "九州大学",
        summary: "再生可能エネルギー由来のアンモニアを直接燃料として高効率に発電する次世代燃料電池。脱炭素社会のキーテクノロジー。",
        potentialApplications: ["分散型電源", "船舶・産業用動力源", "水素キャリア"],
        researchLab: "カーボンニュートラル・エネルギー国際研究所",
        uniqueness: "アンモニアから水素を分離せず直接発電できるため、システム全体を小型化・高効率化できる。触媒の耐久性も高い。",
        potentialImpact: 'High',
        marketRisk: 'Medium',
        techRisk: 'Medium',
    },
];

export const mockSources: Source[] = [
    { uri: 'https://www.jst.go.jp/', title: '科学技術振興機構 (JST)', domain: 'jst.go.jp', snippet: '日本の科学技術の振興を目的とする公的機関です。' },
    { uri: 'https://www.nedo.go.jp/', title: '新エネルギー・産業技術総合開発機構 (NEDO)', domain: 'nedo.go.jp', snippet: '新エネルギーや省エネルギー技術、産業技術の開発を推進しています。' },
    { uri: 'https://www.u-tokyo.ac.jp/ja/research/featured-research/project01.html', title: '東京大学 - 特集/注目の研究', domain: 'u-tokyo.ac.jp', snippet: '東京大学で行われている最新の研究プロジェクトを紹介します。' },
];


// For TechExplanation (getTechExplanation)
export const mockTechExplanation: TechExplanationData = {
    what_is_it: "**ペロブスカイト太陽電池**は、次世代太陽電池の最有力候補の一つです。特殊な結晶構造を持つ「ペロブスカイト」という材料を使い、光を電気に変換します。",
    why_is_it_important: "従来のシリコン系太陽電池と比較して、**軽量で柔軟**、そして**低コスト**で製造できる潜在能力を秘めています。塗布や印刷といった簡単なプロセスで作れるため、製造時のエネルギー消費も少なく済みます。また、曇りの日など弱い光でも比較的に高い効率で発電できるのも大きな利点です。",
    what_future_it_creates: "この技術が実用化されれば、建物の壁や窓、曲面のある自動車の屋根、さらには衣服やカバンといった、これまで太陽電池を設置できなかった様々な場所に発電機能を持たせることが可能になります。まさに「どこでも発電」できる社会の実現に向けたキーテクノロジーと言えるでしょう。"
};

// For OverseasStartups (getOverseasStartups)
export const mockOverseasStartups: OverseasStartup[] = [
  {
    startupName: "Oxford PV",
    country: "イギリス",
    funding: "約1億6000万ドル",
    summary: "ペロブスカイトとシリコンを組み合わせた「タンデム太陽電池」のパイオニア。シリコン単体では超えられない理論限界を超える変換効率を目指している。",
    fundingSourceUrl: "https://www.pv-magazine.com/2022/12/21/oxford-pv-raises-41-million-for-perovskite-tandem-solar-cell-production/",
    business_model: "技術ライセンスおよび高性能太陽電池セルの製造・販売",
    technology_summary: "独自のペロブスカイト-シリコン・タンデム技術により、30%を超える変換効率を実現。既存の太陽光パネル製造ラインに統合可能。",
    key_investors: ["Meyer Burger", "Goldwind", "Legal & General Capital"],
    latest_milestone: "ドイツの工場で商用生産ラインの立ち上げを完了"
  },
  {
    startupName: "Saule Technologies",
    country: "ポーランド",
    funding: "約3000万ユーロ",
    summary: "インクジェット印刷技術を用いた柔軟なペロブスカイト太陽電池シートを開発。ビルやIoTデバイスへの応用を進めており、商業生産も開始している。",
    fundingSourceUrl: "https://notesfrompoland.com/2021/09/03/polish-perovskite-pioneer-saule-technologies-raises-e25-million-for-global-expansion/",
    business_model: "B2B向けにカスタマイズ可能な太陽電池モジュールの販売",
    technology_summary: "独自のインクジェット印刷プロセスにより、軽量で柔軟、半透明なペロブスカイトフィルムを低コストで製造可能。",
    key_investors: ["Columbus Energy", "EIT InnoEnergy", "個人のエンジェル投資家"],
    latest_milestone: "世界初の産業用ペロブスカイト太陽電池生産ラインを稼働開始"
  }
];

// For DeepDiveView (streamDeepDiveOnTech)
export const mockDeepDiveAnalysis: DeepDiveAnalysisData = {
  scorecard: {
    potentialImpact: { score: 10, rationale: "エネルギー問題を根底から覆す可能性がある" },
    marketRisk: { score: 6, rationale: "既存の電力網との連携や価格競争が課題" },
    techRisk: { score: 4, rationale: "長期耐久性の実証が最大のハードル" },
    overallGrade: 'A',
    summary: "技術的ハードルは高いものの、成功すれば市場を独占できるゲームチェンジャー。耐久性の証明が投資の鍵。"
  },
  summary: {
    content: "この技術は、エネルギー産業における「iPhoneモーメント」を引き起こす可能性を秘めた原石だ。現行の太陽電池市場を破壊し、再生可能エネルギーの普及を爆発的に加速させるポテンシャルを持つ。投資の核心は「10年以上の実用的な耐久性を、低コストで実現できるか」という一点に尽きる。"
  },
  potentialImpact: {
    problemAndMarketSize: "化石燃料への依存とエネルギーコストの問題を解決する。世界の太陽光発電市場は2030年までに3000億ドルを超えると予測されており、その大部分を置き換える可能性がある(TAMは数兆円規模)。",
    monopolyPotential: "「軽量・柔軟・高効率」という特性は、シリコンでは代替不可能。特許ポートフォリオを固めることで、特定の応用分野（例：BIPV、モビリティ）で独占的地位を築ける。",
    profitModel: "主に技術ライセンスと、キーとなる高機能材料の販売。将来的には製造プラントの設計・販売も考えられる。"
  },
  marketRisk: {
    customerPain: "法人顧客（電力会社、デベロッパー）にとっては、発電コスト(LCOE)の削減が至上命題。個人顧客にとっては、電気代の削減と災害時の電源確保という強いニーズがある。",
    competition: "既存のシリコン太陽電池に対して、設置場所の自由度と、理論上のコスト優位性で10倍以上の価値を提供できる可能性がある。",
    businessBarriers: "大規模な製造設備の投資が必要。また、電力系統への接続に関する規制や、リサイクルプロセスの確立が課題となる。"
  },
  techRisk: {
    technicalChallenge: "- **長期耐久性:** 水分や酸素による劣化を防ぐ封止技術。\n- **大面積化:** 面積を広げても性能を維持する均一な成膜技術。\n- **鉛の毒性:** 毒性の低い代替材料（スズなど）の研究。",
    trlAndTrackRecord: "現在のTRLは4-5（ラボレベルでの実証）。この研究チームは過去に権威ある科学雑誌に複数の論文を発表しており、信頼性は高い。",
    ipPortfolio: "基本特許は大学が保有。組成や製造プロセスに関する応用特許を複数出願中であり、強固なIPポートフォリオを構築できる見込み。"
  },
  keyFlags: {
    positive: [
      "政府の脱炭素政策による強力な追い風。",
      "主要な材料が比較的安価で豊富に存在する。",
      "軽量で柔軟なため、設置場所の自由度が非常に高い。",
      "曇天時など低照度でも比較的高い発電効率を維持できる。"
    ],
    concerns: [
      "主流材料に含まれる鉛の環境規制リスク。",
      "中国メーカーによる安価なシリコン太陽電池との価格競争。",
      "大面積化に伴う、変換効率の低下と均一性の確保。",
      "リサイクル技術がまだ確立されていない。"
    ]
  },
  killerQuestions: [
    "1000時間の連続照射試験で、変換効率の低下率は何%未満を達成していますか？そのデータを見せてください。",
    "現在のラボスケールの製造コストを、量産時にはどの程度まで下げられると試算していますか？その内訳を教えてください。",
    "鉛フリー材料の研究開発において、現在どの程度の変換効率を達成していますか？実用化までのロードマップを教えてください。",
    "競合であるシリコン太陽電池に対する、実際の発電環境下でのLCOE（均等化発電原価）の優位性をどう示しますか？"
  ]
};

// For ChatView (createDeepDiveChat)
const mockChatResponses: { [key: string]: string } = {
    default: "ご質問ありがとうございます。その点についてですが、この技術の市場リスクは中程度と評価しています。なぜなら、技術自体は画期的であるものの、既存のインフラとの互換性や、規制当局の承認プロセスに不確実性が残るためです。しかし、これらの課題をクリアできれば、莫大なリターンが期待できます。",
    競合: "主要な競合としては、海外のOxford PV社や、国内の他大学発のベンチャーが挙げられます。それぞれ異なるアプローチを取っていますが、我々の技術は独自の添加剤による安定性向上で優位性があると分析しています。",
    ハードル: "実用化に向けた最大の技術的ハードルは、やはり素材の長期安定性の確保です。現在、ラボレベルでは1000時間以上の連続動作を実証していますが、屋外環境での20年以上の寿命を保証するには、さらなる封止技術の改良が必要です。",
};

async function* mockSendMessageStream(userInput: string): AsyncGenerator<GenerateContentResponse, void, unknown> {
    let responseText = mockChatResponses.default;
    if (userInput.includes("競合")) {
        responseText = mockChatResponses['競合'];
    } else if (userInput.includes("ハードル") || userInput.includes("課題")) {
        responseText = mockChatResponses['ハードル'];
    }
    
    const words = responseText.replace(/\n/g, ' \n ').split(' ');
    for (const word of words) {
        if (word === '\n') {
            await new Promise(res => setTimeout(res, 200));
        } else {
            await new Promise(res => setTimeout(res, 60));
        }
        const chunk: Partial<GenerateContentResponse> = { text: word + ' ' };
        yield chunk as GenerateContentResponse;
    }
}

export const mockChatSession: Chat = {
    sendMessageStream: (request: string | { message: string }) => {
        const userInput = typeof request === 'string' ? request : request.message;
        console.log("Mock chat received:", userInput);
        return Promise.resolve(mockSendMessageStream(userInput));
    },
} as unknown as Chat;

// For ChatSuggestions (getChatSuggestions)
export const mockChatSuggestions: string[] = [
    "この技術の長期耐久性について、具体的なデータはありますか？",
    "競合技術と比較した際の、コスト面での優位性を教えてください。",
    "実用化に向けた最大のボトルネックは何ですか？"
];


// Stream generators
export async function* mockTechStream(): AsyncGenerator<DeepTech, void, unknown> {
    for (const tech of mockDeepTechResults) {
        await new Promise(resolve => setTimeout(resolve, 300));
        yield tech;
    }
}

export async function* mockDeepDiveStream(): AsyncGenerator<DeepDiveStreamEvent, void, unknown> {
    // 1. Simulate status update
    yield { type: 'status', message: '体験モードのWeb調査を開始...' };
    await new Promise(res => setTimeout(res, 300));
    
    // 2. Simulate providing sources
    yield { type: 'sources', sources: mockSources };
    await new Promise(res => setTimeout(res, 200));
    
    // 3. Simulate analysis streaming
    yield { type: 'status', message: '体験モードの評価レポートを生成中...' };
    const analysisString = JSON.stringify(mockDeepDiveAnalysis, null, 2);
    const chunks = analysisString.match(/.{1,50}/g) || [];
    for (const chunk of chunks) {
        yield { type: 'analysisChunk', chunk };
        await new Promise(resolve => setTimeout(resolve, 20));
    }
}