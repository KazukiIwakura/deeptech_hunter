



import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { XCircleIcon } from './icons/XCircleIcon';
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MicroscopeIcon } from './icons/MicroscopeIcon';
import { BrainIcon } from './icons/BrainIcon';
import { ChatIcon } from './icons/ChatIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CodeIcon } from './icons/CodeIcon';
import { TerminalIcon } from './icons/TerminalIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { HelpCircleIcon } from './icons/HelpCircleIcon';
import { TimelineIcon } from './icons/TimelineIcon';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { BalanceIcon } from './icons/BalanceIcon';
import { KeyIcon } from './icons/KeyIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { Button } from './common/Button';
import {
  getHuntSystemInstruction,
  getTechExplanationSystemInstruction,
  getOverseasStartupsSystemInstruction,
  getDeepDiveSystemInstruction,
  getChatSystemInstruction,
} from '../services/prompts';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

type ModalTab = 'flow' | 'model' | 'api_key';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ModalTab;
}

interface DetailInfo {
  api: string;
  prompt: string;
  output: string;
}

interface FlowStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isAi?: boolean;
  details?: DetailInfo;
  children?: React.ReactNode;
}

const TechnicalDetails: React.FC<{ details: DetailInfo }> = ({ details }) => (
    <div className="mt-4 ml-8 pl-6 border-l-2 border-dashed border-blue-300 py-3 space-y-4 animate-fade-in">
        <div className="bg-slate-100 p-3 rounded-lg">
            <h5 className={cn('text-base leading-snug font-bold text-slate-800', "flex items-center text-slate-800 mb-1")}>
                <CpuChipIcon className="w-4 h-4 mr-2 text-blue-600"/>API機能
            </h5>
            <p className={cn('text-sm text-slate-600 leading-normal', "text-slate-700 font-mono")}>{details.api}</p>
        </div>
        <div className="bg-slate-100 p-3 rounded-lg">
            <h5 className={cn('text-base leading-snug font-bold text-slate-800', "flex items-center text-slate-800 mb-2")}>
                <TerminalIcon className="w-4 h-4 mr-2 text-blue-600"/>使用プロンプト (システム命令)
            </h5>
            <pre className={cn('text-sm text-slate-600 leading-normal', "text-slate-700 whitespace-pre-wrap font-sans bg-white p-2 rounded-md border border-slate-200 mt-1 overflow-auto max-h-48")}>
              <code>{details.prompt.trim()}</code>
            </pre>
        </div>
        <div className="bg-slate-100 p-3 rounded-lg">
            <h5 className={cn('text-base leading-snug font-bold text-slate-800', "flex items-center text-slate-800 mb-1")}>
                <CodeIcon className="w-4 h-4 mr-2 text-blue-600"/>期待する出力形式
            </h5>
            <pre className={cn('text-sm text-slate-600 leading-normal', "text-white bg-slate-800 p-2 rounded mt-1 overflow-x-auto")}>
              <code>{details.output.trim()}</code>
            </pre>
        </div>
    </div>
);


const FlowStep: React.FC<FlowStepProps> = ({ icon, title, description, isAi, details, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={cn("p-4 rounded-2xl", isAi ? 'bg-blue-50/80 border border-blue-200/80' : 'bg-slate-50/80 border border-slate-200/80')}>
            <div className="flex items-start space-x-4">
                <div className={cn("flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg", isAi ? 'bg-blue-100 text-blue-500' : 'bg-slate-200 text-slate-600')}>
                    {icon}
                </div>
                <div className="flex-grow pt-1">
                    <h4 className={cn('text-base leading-snug font-bold text-slate-800', "text-slate-800")}>{title}</h4>
                    <p className={cn('text-sm text-slate-600 leading-normal', "text-slate-600 mt-0.5")}>{description}</p>
                </div>
                {details && (
                    <Button
                        onClick={() => setIsOpen(!isOpen)}
                        variant="ghost"
                        size="small"
                        className="flex-shrink-0 font-bold text-blue-600 hover:text-blue-800 p-1 mt-1 ml-1"
                        aria-expanded={isOpen}
                    >
                        詳細
                        <ChevronDownIcon className={cn("w-4 h-4 ml-1 transition-transform duration-200", isOpen && 'rotate-180')} />
                    </Button>
                )}
            </div>
            {children}
            {isOpen && details && <TechnicalDetails details={details} />}
        </div>
    );
};


const Arrow: React.FC = () => (
    <div className="h-10 flex items-center justify-center">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m-4-4l4 4 4-4" />
        </svg>
    </div>
);

const SubStep: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md bg-blue-100/80 text-blue-600 mt-0.5">
            {icon}
        </div>
        <div>
            <h5 className={cn('text-base leading-snug font-bold text-slate-800', "text-slate-800")}>{title}</h5>
            <p className={cn('text-sm text-slate-600 leading-normal', "text-slate-600")}>{description}</p>
        </div>
    </div>
);

const ApiKeyManager: React.FC = () => {
    const { appShell } = useApp();
    const { userApiKey, setUserApiKey, clearUserApiKey } = appShell;
    const [localKey, setLocalKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        if (localKey.trim()) {
            setUserApiKey(localKey.trim());
            setLocalKey('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }
    };
    
    const handleDelete = () => {
        clearUserApiKey();
    };

    const maskedKey = userApiKey ? `${userApiKey.slice(0, 4)}...${userApiKey.slice(-4)}` : '';

    const StatusDisplay: React.FC = () => {
        if (userApiKey) {
            return (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">APIキーはブラウザに保存済みです: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">{maskedKey}</code></span>
                </div>
            )
        }
        return (
             <div className="flex items-center gap-2 p-3 bg-slate-100 border border-slate-200 rounded-lg">
                <HelpCircleIcon className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-semibold text-slate-800">APIキーが設定されていません。</span>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <h3 className={cn('text-[22px] leading-snug font-bold text-slate-800', "text-slate-800 flex items-center")}>
                <KeyIcon className="w-6 h-6 mr-3 text-blue-500" />
                APIキーの設定
            </h3>

            <StatusDisplay />

            <div className="space-y-2">
                <label htmlFor="api-key-input" className="font-bold text-slate-700 text-sm">Google Gemini APIキー</label>
                <div className="relative">
                     <input
                        id="api-key-input"
                        type={showKey ? 'text' : 'password'}
                        value={localKey}
                        onChange={(e) => setLocalKey(e.target.value)}
                        placeholder={userApiKey ? '新しいキーを入力して上書き' : 'ここにAPIキーを貼り付け'}
                        className="w-full pl-3 pr-10 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-800"
                        aria-label={showKey ? "APIキーを隠す" : "APIキーを表示する"}
                    >
                        {showKey ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleSave}
                        disabled={!localKey.trim()}
                        variant="primary"
                        size="small"
                    >
                        保存する
                    </Button>
                    {userApiKey && (
                        <Button onClick={handleDelete} variant="secondary" size="small">
                            保存したキーを削除
                        </Button>
                    )}
                     {showSuccess && <span className="text-emerald-600 font-semibold animate-fade-in text-sm">保存しました！</span>}
                </div>
            </div>
             <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-900">
                <h4 className={cn('text-base leading-snug font-bold text-slate-800', "text-amber-800 mb-1 flex items-center font-bold")}>
                    <HelpCircleIcon className="w-5 h-5 mr-2" />
                    重要
                </h4>
                <p className="text-sm text-amber-800 leading-relaxed pl-7">
                    APIキーは、お使いのブラウザのローカルストレージに保存されます。この情報は外部のサーバーには送信されません。共有PCなど、他人がアクセスできる環境ではキーを設定しないでください。
                    キーは <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-amber-700">Google AI Studio</a> から取得できます。
                </p>
            </div>
        </div>
    );
};

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, initialTab = 'flow' }) => {
  const [selectedTab, setSelectedTab] = useState<ModalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setSelectedTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn('bg-white rounded-4xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col', "animate-fade-in")}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className={cn('text-[22px] leading-snug font-bold text-slate-800', "text-slate-800 flex items-center")}>
            <SparklesIcon className="w-6 h-6 mr-3 text-blue-500" />
            このAIの仕組み
          </h2>
          <Button onClick={onClose} variant="ghost" size="medium" isIconOnly aria-label="閉じる">
            <XCircleIcon className="w-6 h-6" />
          </Button>
        </header>

        <div className="border-b border-slate-200 px-4">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <button
              className={cn(
                'px-1 py-3 border-b-2 whitespace-nowrap',
                'text-sm text-slate-600 leading-normal', 'font-bold',
                selectedTab === 'flow'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
              onClick={() => setSelectedTab('flow')}
            >
              主な処理フロー
            </button>
            <button
              className={cn(
                'px-1 py-3 border-b-2 whitespace-nowrap',
                'text-sm text-slate-600 leading-normal', 'font-bold',
                selectedTab === 'model'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
              onClick={() => setSelectedTab('model')}
            >
              思考モデルについて
            </button>
            <button
              className={cn(
                'px-1 py-3 border-b-2 whitespace-nowrap',
                'text-sm text-slate-600 leading-normal', 'font-bold',
                selectedTab === 'api_key'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
              onClick={() => setSelectedTab('api_key')}
            >
              APIキー設定
            </button>
          </nav>
        </div>

        <main className="flex-1 overflow-y-auto">
          {selectedTab === 'flow' && (
            <div className="p-6 md:p-8 space-y-5">
              <FlowStep
                icon={<UserIcon className="w-6 h-6" />}
                title="1. ユーザーによるキーワード入力"
                description="ユーザーは探したい技術のキーワード（例：全固体電池）を入力するか、AIが提案したトレンド分野から選択します。"
              />
              <Arrow />
              <FlowStep
                icon={<BrainIcon className="w-6 h-6" />}
                title="2. 3つのAIによる並列調査実行"
                description="キーワードに基づき、3つの専門AIエージェントが同時に調査を開始します。それぞれがGoogle検索ツールなどを駆使して情報を収集・分析します。"
                isAi
              >
                  <div className="mt-4 ml-8 pl-6 border-l-2 border-dashed border-blue-300 py-3 space-y-4">
                      <FlowStep
                          icon={<LightbulbIcon className="w-5 h-5" />}
                          title="解説AI"
                          description="技術の概要を分かりやすく解説します。"
                          isAi
                          details={{ api: 'ai.models.generateContent', prompt: getTechExplanationSystemInstruction(), output: 'JSON Object' }}
                      />
                      <FlowStep
                          icon={<SparklesIcon className="w-5 h-5" />}
                          title="国内探索AI"
                          description="日本の大学から技術シーズを発掘します。"
                          isAi
                          details={{ api: 'ai.models.generateContent', prompt: getHuntSystemInstruction(), output: 'JSON in Markdown' }}
                      >
                        <div className="mt-4 ml-8 pl-6 border-l-2 border-dashed border-blue-300 py-3 space-y-4">
                          <SubStep icon={<BrainIcon className="w-4 h-4" />} title="1. キーワード再定義" description="ユーザー入力を専門用語に変換し、調査の精度を高めます。" />
                          <SubStep icon={<ZoomInIcon className="w-4 h-4" />} title="2. 体系的な情報収集" description="大学DBや公的機関を優先的にGoogle検索で調査します。" />
                          <SubStep icon={<BalanceIcon className="w-4 h-4" />} title="3. VC的評価と選別" description="インパクト・市場リスク・技術リスクの3軸で評価します。" />
                          <SubStep icon={<CodeIcon className="w-4 h-4" />} title="4. 構造化レポート生成" description="評価の高い技術シーズをJSON形式で出力します。" />
                        </div>
                      </FlowStep>
                      <FlowStep
                          icon={<BriefcaseIcon className="w-5 h-5" />}
                          title="海外調査AI"
                          description="海外注目スタートアップを調査します。"
                          isAi
                          details={{ api: 'ai.models.generateContent', prompt: getOverseasStartupsSystemInstruction(), output: 'JSON in Markdown' }}
                      />
                  </div>
              </FlowStep>
              <Arrow />
              <FlowStep
                icon={<MicroscopeIcon className="w-6 h-6" />}
                title="3. 詳細分析 (Deep Dive)"
                description="ユーザーが特定の技術を選択すると、VC（ベンチャーキャピタリスト）の視点で詳細なビジネス評価レポートを生成します。"
                isAi
                details={{
                    api: 'ai.models.generateContentStream',
                    prompt: getDeepDiveSystemInstruction(),
                    output: 'JSON Object Stream',
                }}
              />
              <Arrow />
               <FlowStep
                icon={<ChatIcon className="w-6 h-6" />}
                title="4. 対話による深掘り"
                description="生成されたレポートを元に、ユーザーはAIと対話を開始。AIは鋭い質問を提案し、さらなる分析や議論をサポートします。"
                isAi
                 details={{
                    api: 'ai.chats.create / chat.sendMessageStream',
                    prompt: getChatSystemInstruction(),
                    output: 'テキストストリーム',
                }}
              />
            </div>
          )}
          {selectedTab === 'model' && (
             <div className="p-6 md:p-8 text-slate-700 animate-fade-in space-y-6">
                <h3 className={cn('text-[22px] leading-snug font-bold text-slate-800', "text-slate-800 flex items-center")}><BrainIcon className="w-6 h-6 mr-3 text-blue-500" />このAIの思考モデル: ReAct</h3>
                <p className="text-base text-slate-700/90 leading-relaxed">
                  このアプリケーションの中核をなすAIは、単に質問に答えるだけではありません。それは、<strong>ReAct (Reasoning and Acting)</strong> という高度な思考フレームワークに基づいて動作しています。これは、AIが人間のように「思考」と「行動」を繰り返すことで、複雑なタスクを解決するアプローチです。
                </p>
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                    <h4 className={cn('text-base leading-snug font-bold text-slate-800', "text-slate-800 mb-2")}>ReActのサイクル</h4>
                    <ol className={cn('text-sm text-slate-600 leading-normal', "list-decimal list-inside space-y-2")}>
                        <li><strong>Reason (思考):</strong> 次に何をすべきか、どのような情報が必要かを計画します。例えば、「国内の技術を調べる」「海外の先行事例を探す」といった戦略を立てます。</li>
                        <li><strong>Act (行動):</strong> 立てた計画を実行するために、<strong>ツール</strong>を使用します。このアプリでは、主に「Google検索」がそのツールにあたります。</li>
                        <li><strong>Observation (観察):</strong> ツールの実行結果（検索結果など）を取得し、分析します。</li>
                        <li>このサイクルを繰り返し、最終的な結論やレポートを生成します。</li>
                    </ol>
                </div>
                <p className="text-base text-slate-700/90 leading-relaxed">
                  このReActモデルにより、AIはまるで優秀なリサーチアナリストのチームのように、自律的に計画を立て、情報を収集・分析し、ユーザーに価値ある洞察を提供することができるのです。
                </p>

                <h3 className={cn('text-[22px] leading-snug font-bold text-slate-800', "text-slate-800 flex items-center pt-4 border-t border-slate-200 mt-8")}><HelpCircleIcon className="w-6 h-6 mr-3 text-blue-500" />Perplexityなどの検索AIとの違い</h3>
                <p className="text-base text-slate-700/90 leading-relaxed">
                  Perplexityのような対話型検索エンジンも非常に強力ですが、このアプリケーションは少し異なるアプローチを取っています。
                </p>
                <p className="text-base text-slate-700/90 leading-relaxed">
                  多くの検索AIが「ユーザーの質問に対してウェブを検索して要約する」という単一のタスクに特化しているのに対し、ディープテックハンターのAIは、<strong>複数の異なるタスクを組み合わせた、より大きなワークフロー</strong>を実行します。
                </p>
                <ul className={cn('text-sm text-slate-600 leading-normal', "list-disc list-inside space-y-2 pl-2")}>
                  <li><strong>並列タスク実行:</strong> 「国内技術の探索」「海外スタートアップ調査」「技術用語の解説」といった複数の調査を同時に並行して実行し、時間を節約します。</li>
                  <li><strong>ネイティブなツール連携:</strong> 外部の検索サービスを呼び出すのではなく、Geminiに組み込まれたGoogle検索ツールを直接、自律的に使用します。これにより、AIの「思考」と「情報収集」がシームレスに連携し、より文脈に沿った質の高いアウトプットが期待できます。</li>
                  <li><strong>目的特化:</strong> 全てのプロセスは「ディープテックを発掘・評価する」という明確な目的に特化して設計されています。</li>
                </ul>
                <p className={cn('text-base text-slate-700/90 leading-relaxed', "mt-4")}>
                  つまり、単なる「検索して答える」AIではなく、<strong>「特定の目的を達成するために、自ら計画し、ツールを使いこなす専門家AI」</strong>であることが、このアプリケーションの最大の特徴です。
                </p>
              </div>
          )}
          {selectedTab === 'api_key' && (
            <div className="p-6 md:p-8 text-slate-700 animate-fade-in space-y-6">
              <ApiKeyManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
