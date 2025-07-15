
import type { DeepTech, Source, OverseasStartup, TechExplanationData, DeepDiveAnalysisData } from '../types';
import type { Chat, GenerateContentResponse } from "@google/genai";
import type { DeepDiveStreamEvent } from './gemini/deepdive';


// For DiscoveryZone
export const mockDiscoverySuggestions: string[] = [
  "ペロブスカイト・シリコンタンデム太陽電池",
  "液体バイオプシー用マイクロ流体チップ",
  "量子もつれ光通信システム",
  "セルロースナノファイバー複合材料",
  "人工光合成CO2還元触媒",
  "脳オルガノイド創薬プラットフォーム",
  "全固体リチウム金属電池",
  "バイオハイブリッドロボット",
  "培養肉用3D細胞足場材料",
  "テラヘルツ波イメージングセンサー"
];

// For ResultsDisplay (streamHuntDeepTech)
export const mockDeepTechResults: DeepTech[] = [
  {
    id: 'mock-tech-1',
    techName: "セルロースナノファイバー強化複合材料",
    university: "京都大学",
    summary: "木材由来のセルロースナノファイバー（CNF）を用いた超軽量・高強度複合材料。鋼鉄の5倍の強度を持ちながら重量は1/5という革新的特性を実現。自動車・航空機の軽量化に大きく貢献する。",
    potentialApplications: ["自動車ボディ・内装材", "航空機構造材", "建築材料", "スポーツ用品"],
    researchLab: "生存圏研究所 矢野研究室",
    uniqueness: "独自の化学修飾技術により、CNFと樹脂の界面接着性を大幅に向上。従来比3倍の強度向上を実現し、量産プロセスも確立済み。",
    potentialImpact: 'High',
    marketRisk: 'Medium',
    techRisk: 'Low',
  },
  {
    id: 'mock-tech-2',
    techName: "液体バイオプシー用マイクロ流体チップ",
    university: "東京大学",
    summary: "血液中の循環腫瘍細胞（CTC）を高精度で捕捉・解析するマイクロ流体デバイス。従来の組織生検に代わる低侵襲ながん診断技術として、早期発見と治療効果モニタリングを可能にする。",
    potentialApplications: ["がん早期診断", "治療効果モニタリング", "転移リスク評価", "個別化医療"],
    researchLab: "先端科学技術研究センター 藤井研究室",
    uniqueness: "独自のマイクロピラー構造により、従来技術の10倍の捕捉効率を実現。1ml の血液から数個のCTCを検出可能で、診断精度95%以上を達成。",
    potentialImpact: 'High',
    marketRisk: 'Medium',
    techRisk: 'Medium',
  },
  {
    id: 'mock-tech-3',
    techName: "全固体リチウム金属電池",
    university: "東北大学",
    summary: "硫化物系固体電解質を用いた次世代蓄電池。従来のリチウムイオン電池の3倍のエネルギー密度と高い安全性を両立。電気自動車の航続距離を大幅に延長し、充電時間も短縮する。",
    potentialApplications: ["電気自動車用バッテリー", "定置用蓄電システム", "ドローン・eVTOL", "宇宙・極地用電源"],
    researchLab: "多元物質科学研究所 本間研究室",
    uniqueness: "独自の硫化物ガラス電解質により、室温でのイオン伝導度10⁻³ S/cm を達成。リチウム金属負極との界面安定性も大幅に改善し、1000回以上の充放電サイクルを実現。",
    potentialImpact: 'High',
    marketRisk: 'Low',
    techRisk: 'High',
  },
];

export const mockSources: Source[] = [
  { uri: 'https://www.kyoto-u.ac.jp/ja/research/research-results/2023/231215_1', title: 'セルロースナノファイバー複合材料の強度向上に成功 - 京都大学', domain: 'kyoto-u.ac.jp', snippet: '木材由来CNFを用いた複合材料で従来比3倍の強度向上を実現。自動車・航空機への応用に期待。' },
  { uri: 'https://www.jst.go.jp/pr/announce/20231201/index.html', title: 'マイクロ流体チップによる循環腫瘍細胞の高精度検出技術 - JST', domain: 'jst.go.jp', snippet: '東京大学の研究チームが開発した液体バイオプシー技術が臨床応用段階に。' },
  { uri: 'https://www.tohoku.ac.jp/japanese/2023/11/press20231128-01-battery.html', title: '全固体電池の界面安定性を大幅改善 - 東北大学', domain: 'tohoku.ac.jp', snippet: '硫化物系固体電解質により1000回以上の充放電サイクルを実現。' },
  { uri: 'https://www.nedo.go.jp/news/press/AA5_101583.html', title: 'CNF複合材料の実用化に向けた技術開発 - NEDO', domain: 'nedo.go.jp', snippet: 'セルロースナノファイバーを用いた軽量高強度材料の産業応用プロジェクト。' },
];


// For TechExplanation (getTechExplanation)
export const mockTechExplanation: TechExplanationData = {
  what_is_it: "**セルロースナノファイバー（CNF）**は、木材の主成分であるセルロースを、髪の毛の2万分の1という極細のナノレベルまで解きほぐした繊維状の材料です。この超微細な繊維を樹脂と組み合わせることで、従来の材料では実現できない**超軽量かつ超高強度**の複合材料を作ることができます。",
  why_is_it_important: "CNF複合材料は**鋼鉄の5倍の強度を持ちながら重量は5分の1**という驚異的な特性を実現します。しかも原料は豊富な木材であり、**カーボンニュートラル**な材料として環境負荷も極めて低い。自動車や航空機の軽量化により燃費向上・CO2削減に大きく貢献し、持続可能な社会の実現に不可欠な技術です。",
  what_future_it_creates: "この技術が普及すれば、自動車は現在の半分の重量で同等以上の安全性を実現し、航空機はより少ない燃料で長距離飛行が可能になります。建築分野では**木造超高層ビル**の建設も現実的となり、都市の景観を一変させるでしょう。まさに「軽くて強い」が当たり前の社会を創造する革新的技術です。"
};

// For OverseasStartups (getOverseasStartups)
export const mockOverseasStartups: OverseasStartup[] = [
  {
    startupName: "CelluForce",
    country: "カナダ",
    funding: "約8500万カナダドル",
    summary: "世界最大級のセルロースナノクリスタル（CNC）製造企業。独自の硫酸加水分解技術により高品質なナノセルロースを大量生産し、複合材料、コーティング、3Dプリンティング材料として展開。",
    fundingSourceUrl: "https://www.celluforce.com/en/news/celluforce-announces-major-expansion/",
    business_model: "ナノセルロース原料の製造・販売およびカスタム材料開発",
    technology_summary: "独自の硫酸加水分解プロセスにより、高結晶性・高純度のセルロースナノクリスタルを年間数千トン規模で製造。自動車・航空宇宙産業向けの高性能複合材料を開発。",
    key_investors: ["Domtar Corporation", "FPInnovations", "カナダ政府"],
    latest_milestone: "年産能力を300トンから1000トンに拡大する新工場の建設完了"
  },
  {
    startupName: "American Process Inc.",
    country: "アメリカ",
    funding: "約1億2000万ドル",
    summary: "バイオリファイナリー技術を用いてセルロースナノファイバーを製造する米国のパイオニア企業。独自のAVAP技術により、木材チップから高品質なCNFを効率的に抽出・精製。",
    fundingSourceUrl: "https://www.americanprocess.com/news/api-secures-120m-funding-cnf-commercialization/",
    business_model: "CNF製造技術のライセンスおよび高機能CNF材料の販売",
    technology_summary: "AVAP（Ammonia Vapor Alkaline Pretreatment）技術により、従来法の半分のエネルギーでCNFを製造。自動車内装材、包装材、建材への応用で商業化を推進。",
    key_investors: ["USDA", "DOE", "Georgia-Pacific", "Kimberly-Clark"],
    latest_milestone: "ジョージア州に年産1万トン規模のCNF商業生産プラントを開設"
  },
  {
    startupName: "Borregaard",
    country: "ノルウェー",
    funding: "約5000万ユーロ（IPO含む）",
    summary: "100年以上の歴史を持つバイオリファイナリー企業が、セルロースナノファイバー事業に本格参入。独自のExilva技術により、高品質なマイクロフィブリル化セルロースを製造。",
    fundingSourceUrl: "https://www.borregaard.com/news/borregaard-invests-50m-euros-cnf-expansion/",
    business_model: "特殊セルロース製品の製造・販売およびバイオ化学品事業",
    technology_summary: "Exilva技術により、化学修飾を最小限に抑えた天然由来のマイクロフィブリル化セルロースを製造。食品、化粧品、塗料、建材など幅広い用途で展開。",
    key_investors: ["ノルウェー政府系ファンド", "Orkla ASA", "機関投資家"],
    latest_milestone: "Exilva製品の年間販売量が1000トンを突破、アジア市場への本格展開を開始"
  }
];

// For DeepDiveView (streamDeepDiveOnTech)
export const mockDeepDiveAnalysis: DeepDiveAnalysisData = {
  scorecard: {
    potentialImpact: { score: 9, rationale: "自動車・航空機産業の軽量化革命を牽引し、脱炭素社会実現に直結" },
    marketRisk: { score: 7, rationale: "既存材料メーカーとの競争は激しいが、明確な顧客ニーズが存在" },
    techRisk: { score: 8, rationale: "基礎技術は確立済み、量産技術の最適化が主な課題" },
    overallGrade: 'A',
    summary: "技術リスクが低く市場ニーズが明確な、投資対効果の高い有望案件。量産体制の構築が成功の鍵。"
  },
  summary: {
    content: "**セルロースナノファイバー複合材料**は、材料工学における「パラダイムシフト」を引き起こす革新技術だ。鋼鉄の5倍の強度と1/5の重量という物性は、自動車・航空機産業の軽量化ニーズに完璧にマッチし、脱炭素社会実現の切り札となる。技術的成熟度が高く、既に量産プロセスも確立されているため、**投資リスクが相対的に低い**のが最大の魅力。投資判断の核心は「いかに早く大規模な生産体制を構築し、市場シェアを獲得するか」にある。"
  },
  potentialImpact: {
    problemAndMarketSize: "**軽量化による燃費向上・CO2削減**という全産業共通の課題を解決する。世界の複合材料市場は2030年までに1500億ドル規模に成長予測。特に自動車軽量化材料市場（年率8%成長）と航空機複合材料市場（年率10%成長）での需要が急拡大している。",
    monopolyPotential: "**木材由来・カーボンニュートラル・超高性能**という3つの特性を同時に満たす材料は他に存在しない。特に日本の豊富な森林資源と高度な化学修飾技術の組み合わせにより、**10年間の技術的優位性**を維持できる可能性が高い。",
    profitModel: "**B2B向け高機能材料販売**が主軸。自動車メーカー向けは量産効果でコスト競争力を発揮し、航空機向けは高付加価値で高利益率を実現。さらに製造技術ライセンスや、カスタム材料開発サービスでも収益化可能。"
  },
  marketRisk: {
    customerPain: "自動車業界では**CAFE規制**による燃費向上圧力が強く、軽量化は死活問題。航空機業界では燃料費削減と環境規制対応が急務。両業界とも「軽くて強い材料」への需要は極めて強い。",
    competition: "炭素繊維（CFRP）が主要競合だが、CNFは**製造エネルギーが1/10、コストは1/3**という圧倒的優位性を持つ。また、リサイクル性とカーボンニュートラル性で差別化が図れる。",
    businessBarriers: "自動車・航空機業界の**認証取得**に2-3年要する。また、年産数万トン規模の製造設備投資（100-200億円）が必要。しかし、これらは参入障壁として機能し、先行者利益を確保できる。"
  },
  techRisk: {
    technicalChallenge: "- **界面接着性の最適化:** CNFと樹脂の化学結合を安定化する表面処理技術\n- **分散均一性:** 大量生産時のナノファイバー分散制御\n- **成形プロセス:** 複雑形状部品への適用技術",
    trlAndTrackRecord: "**TRL 7-8（実証段階）**に到達済み。京都大学生存圏研究所は20年以上のCNF研究実績を持ち、Nature、Science誌への論文掲載多数。既に企業との共同研究で実用化レベルの成果を達成。",
    ipPortfolio: "**基本特許群を大学が保有**し、化学修飾・複合化技術で50件以上の特許を出願中。海外特許も戦略的に取得しており、**強固な知財ポートフォリオ**を構築済み。"
  },
  keyFlags: {
    positive: [
      "日本政府のカーボンニュートラル政策とバイオマス活用戦略に完全合致",
      "豊富な国内森林資源により原料調達リスクが極めて低い",
      "既存の化学プラント設備を活用した量産が可能で設備投資を抑制",
      "自動車・航空機メーカーからの引き合いが既に多数存在"
    ],
    concerns: [
      "炭素繊維メーカー（東レ、三菱ケミカル等）による対抗技術開発",
      "中国・韓国企業による低価格攻勢の可能性",
      "自動車業界の電動化加速による軽量化ニーズの変化",
      "大規模量産時の品質安定性確保"
    ]
  },
  killerQuestions: [
    "現在の製造コスト（円/kg）と、年産1万トン時の目標コストを具体的に教えてください。CFRPとの価格競争力はいかがですか？",
    "トヨタ・ホンダ等の自動車メーカーとの技術評価や採用検討の進捗状況を教えてください。",
    "量産時の品質管理体制はどう構築しますか？特に強度のばらつきを±5%以内に抑える技術的根拠を示してください。",
    "海外展開戦略として、どの地域・企業をターゲットにしていますか？知財保護の観点からのリスクはありませんか？"
  ]
};

// For ChatView (createDeepDiveChat)
const mockChatResponses: { [key: string]: string } = {
  default: "ご質問ありがとうございます。セルロースナノファイバー複合材料の市場リスクは中程度と評価していますが、これは技術的な課題よりも市場浸透の速度に関する不確実性によるものです。自動車・航空機業界での認証プロセスには時間がかかりますが、一度採用されれば長期的な需要が見込めるため、投資対効果は非常に高いと考えています。",
  競合: "主要な競合は炭素繊維（CFRP）メーカーの東レ、三菱ケミカル、そして海外のCelluForce、American Process Inc.などです。しかし、我々のCNF技術は製造エネルギーが1/10、コストが1/3という圧倒的な優位性があります。さらに、カーボンニュートラル性とリサイクル性で明確な差別化を図れるため、競争力は十分にあると分析しています。",
  ハードル: "実用化に向けた最大のハードルは、大量生産時の品質安定性の確保です。特に、CNFと樹脂の界面接着性を均一に保ち、強度のばらつきを±5%以内に抑える技術が重要です。現在、独自の化学修飾技術でこの課題をクリアしており、年産1万トン規模での量産技術も確立済みです。むしろ、設備投資と市場開拓のスピードが成功の鍵となるでしょう。",
  コスト: "現在のラボスケールでは1kg当たり約5000円ですが、年産1万トン規模では1000円以下まで下げられる見込みです。CFRPが3000-5000円/kgなので、十分な価格競争力を持てます。さらに、加工性の良さにより成形コストも削減できるため、トータルコストでは大幅な優位性を実現できます。",
  自動車: "トヨタ、ホンダ、日産の3社と技術評価を進めており、特にトヨタからは2025年の新型車への採用を前提とした本格的な検討が始まっています。軽量化による燃費向上効果が明確で、CAFE規制対応にも直結するため、自動車メーカーの関心は非常に高いです。"
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
  "CFRPと比較した際の、製造コストと性能面での優位性を教えてください。",
  "自動車メーカーとの技術評価や採用検討の進捗状況はいかがですか？",
  "量産時の品質安定性確保について、具体的な技術的根拠を教えてください。"
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