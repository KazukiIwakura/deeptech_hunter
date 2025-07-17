import type { Source } from '../../types';

export interface ReliabilityScore {
    score: number; // 0-100
    factors: ReliabilityFactor[];
    category: 'high' | 'medium' | 'low';
}

export interface ReliabilityFactor {
    type: 'domain_authority' | 'content_type' | 'recency' | 'academic_source';
    score: number;
    description: string;
}

// 信頼できるドメインのホワイトリスト
const TRUSTED_DOMAINS = {
    academic: [
        'ac.jp', 'edu', 'researchgate.net', 'scholar.google.com',
        'ieee.org', 'nature.com', 'science.org', 'cell.com'
    ],
    government: [
        'go.jp', 'gov', 'jst.go.jp', 'nedo.go.jp', 'riken.jp'
    ],
    reputable_news: [
        'nikkei.com', 'reuters.com', 'bloomberg.com', 'techcrunch.com',
        'wired.com', 'mit.edu', 'stanford.edu'
    ]
};

export class SourceReliabilityAnalyzer {

    analyzeSource(source: Source): ReliabilityScore {
        const factors: ReliabilityFactor[] = [];
        let totalScore = 0;

        // ドメイン権威性の評価
        const domainScore = this.evaluateDomainAuthority(source.domain);
        factors.push({
            type: 'domain_authority',
            score: domainScore,
            description: `Domain authority: ${source.domain}`
        });
        totalScore += domainScore * 0.4; // 40%の重み

        // コンテンツタイプの評価
        const contentScore = this.evaluateContentType(source);
        factors.push({
            type: 'content_type',
            score: contentScore,
            description: `Content type evaluation based on title and snippet`
        });
        totalScore += contentScore * 0.3; // 30%の重み

        // 学術ソースの評価
        const academicScore = this.evaluateAcademicSource(source);
        factors.push({
            type: 'academic_source',
            score: academicScore,
            description: `Academic source indicators`
        });
        totalScore += academicScore * 0.3; // 30%の重み

        const finalScore = Math.min(100, Math.max(0, totalScore));

        return {
            score: finalScore,
            factors,
            category: this.categorizeScore(finalScore)
        };
    }

    private evaluateDomainAuthority(domain: string): number {
        const lowerDomain = domain.toLowerCase();

        // 学術機関
        if (TRUSTED_DOMAINS.academic.some(trusted => lowerDomain.includes(trusted))) {
            return 90;
        }

        // 政府機関
        if (TRUSTED_DOMAINS.government.some(trusted => lowerDomain.includes(trusted))) {
            return 85;
        }

        // 信頼できるニュースソース
        if (TRUSTED_DOMAINS.reputable_news.some(trusted => lowerDomain.includes(trusted))) {
            return 75;
        }

        // 大学ドメイン
        if (lowerDomain.includes('university') || lowerDomain.includes('univ') ||
            lowerDomain.includes('college') || lowerDomain.endsWith('.ac.jp')) {
            return 80;
        }

        // 研究機関
        if (lowerDomain.includes('research') || lowerDomain.includes('institute') ||
            lowerDomain.includes('lab')) {
            return 70;
        }

        return 50; // デフォルト
    }

    private evaluateContentType(source: Source): number {
        const title = source.title.toLowerCase();
        const snippet = source.snippet?.toLowerCase() || '';
        const content = `${title} ${snippet}`;

        let score = 50;

        // 学術的キーワード
        const academicKeywords = ['research', 'study', 'paper', 'journal', 'publication',
            'university', 'professor', 'laboratory', '研究', '論文', '大学'];
        const academicMatches = academicKeywords.filter(keyword => content.includes(keyword)).length;
        score += academicMatches * 5;

        // 技術的キーワード
        const techKeywords = ['technology', 'innovation', 'development', 'patent', 'startup',
            '技術', '特許', 'イノベーション', '開発'];
        const techMatches = techKeywords.filter(keyword => content.includes(keyword)).length;
        score += techMatches * 3;

        // ネガティブキーワード
        const negativeKeywords = ['blog', 'opinion', 'rumor', 'gossip', '噂', 'ブログ'];
        const negativeMatches = negativeKeywords.filter(keyword => content.includes(keyword)).length;
        score -= negativeMatches * 10;

        return Math.min(100, Math.max(0, score));
    }

    private evaluateAcademicSource(source: Source): number {
        const title = source.title.toLowerCase();
        const snippet = source.snippet?.toLowerCase() || '';
        const content = `${title} ${snippet}`;

        let score = 30;

        // 論文・研究指標
        if (content.includes('doi:') || content.includes('arxiv') || content.includes('pubmed')) {
            score += 40;
        }

        // 引用指標
        if (content.includes('cited') || content.includes('citation') || content.includes('引用')) {
            score += 20;
        }

        // 査読指標
        if (content.includes('peer-reviewed') || content.includes('peer review') || content.includes('査読')) {
            score += 30;
        }

        return Math.min(100, score);
    }

    private categorizeScore(score: number): 'high' | 'medium' | 'low' {
        if (score >= 75) return 'high';
        if (score >= 50) return 'medium';
        return 'low';
    }

    // 複数ソースの総合信頼性評価
    evaluateSourceSet(sources: Source[]): {
        overallReliability: number;
        highQualitySources: number;
        recommendations: string[];
    } {
        if (sources.length === 0) {
            return {
                overallReliability: 0,
                highQualitySources: 0,
                recommendations: ['情報源が不足しています。追加の調査が必要です。']
            };
        }

        const scores = sources.map(source => this.analyzeSource(source));
        const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
        const highQualityCount = scores.filter(s => s.category === 'high').length;

        const recommendations: string[] = [];

        if (averageScore < 60) {
            recommendations.push('情報源の信頼性が低めです。より権威のあるソースからの情報収集を推奨します。');
        }

        if (highQualityCount < sources.length * 0.3) {
            recommendations.push('高品質な学術・政府系ソースの比率を増やすことを推奨します。');
        }

        if (sources.length < 3) {
            recommendations.push('より多様な情報源からの検証を推奨します。');
        }

        return {
            overallReliability: averageScore,
            highQualitySources: highQualityCount,
            recommendations
        };
    }
}

export const sourceReliabilityAnalyzer = new SourceReliabilityAnalyzer();