// hooks/useApiUsageMonitor.ts
import { useState, useCallback, useEffect } from 'react';

interface UsageStats {
  dailyUsage: number;
  weeklyUsage: number;
  monthlyUsage: number;
}

const DAILY_LIMIT = 50;   // 1日のリクエスト制限
const WEEKLY_LIMIT = 300; // 1週間のリクエスト制限
const MONTHLY_LIMIT = 1000; // 1ヶ月のリクエスト制限

export const useApiUsageMonitor = () => {
  const [usage, setUsage] = useState<UsageStats>({
    dailyUsage: 0,
    weeklyUsage: 0,
    monthlyUsage: 0
  });

  // 使用量データの読み込み
  const loadUsageData = useCallback(() => {
    const today = new Date().toDateString();
    const thisWeek = getWeekKey(new Date());
    const thisMonth = getMonthKey(new Date());

    const dailyUsage = parseInt(localStorage.getItem(`api_usage_daily_${today}`) || '0');
    const weeklyUsage = parseInt(localStorage.getItem(`api_usage_weekly_${thisWeek}`) || '0');
    const monthlyUsage = parseInt(localStorage.getItem(`api_usage_monthly_${thisMonth}`) || '0');

    setUsage({ dailyUsage, weeklyUsage, monthlyUsage });
  }, []);

  // APIコール追跡
  const trackApiCall = useCallback((): boolean => {
    const today = new Date().toDateString();
    const thisWeek = getWeekKey(new Date());
    const thisMonth = getMonthKey(new Date());

    const currentDaily = parseInt(localStorage.getItem(`api_usage_daily_${today}`) || '0');
    const currentWeekly = parseInt(localStorage.getItem(`api_usage_weekly_${thisWeek}`) || '0');
    const currentMonthly = parseInt(localStorage.getItem(`api_usage_monthly_${thisMonth}`) || '0');

    // 制限チェック
    if (currentDaily >= DAILY_LIMIT) {
      alert(`1日のAPI使用制限（${DAILY_LIMIT}回）に達しました。\n\n【制限の理由】\n・AIサービスの計算コストを管理するため\n・予期しない高額請求を防ぐため\n・システム全体の安定性を保つため\n\n制限は毎日午前0時に自動リセットされます。緊急時は設定画面から手動リセットも可能です。`);
      return false;
    }

    if (currentWeekly >= WEEKLY_LIMIT) {
      alert(`1週間のAPI使用制限（${WEEKLY_LIMIT}回）に達しました。\n\n【制限の理由】\n・AIサービスの計算コストを管理するため\n・予期しない高額請求を防ぐため\n・システム全体の安定性を保つため\n\n制限は毎週自動リセットされます。緊急時は設定画面から手動リセットも可能です。`);
      return false;
    }

    if (currentMonthly >= MONTHLY_LIMIT) {
      alert(`1ヶ月のAPI使用制限（${MONTHLY_LIMIT}回）に達しました。\n\n【制限の理由】\n・AIサービスの計算コストを管理するため\n・予期しない高額請求を防ぐため\n・システム全体の安定性を保つため\n\n制限は毎月自動リセットされます。緊急時は設定画面から手動リセットも可能です。`);
      return false;
    }

    // 使用量を増加
    const newDaily = currentDaily + 1;
    const newWeekly = currentWeekly + 1;
    const newMonthly = currentMonthly + 1;

    localStorage.setItem(`api_usage_daily_${today}`, newDaily.toString());
    localStorage.setItem(`api_usage_weekly_${thisWeek}`, newWeekly.toString());
    localStorage.setItem(`api_usage_monthly_${thisMonth}`, newMonthly.toString());

    setUsage({
      dailyUsage: newDaily,
      weeklyUsage: newWeekly,
      monthlyUsage: newMonthly
    });

    // 警告表示（制限の80%に達した場合）
    if (newDaily >= DAILY_LIMIT * 0.8) {
      console.warn(`1日のAPI使用量が制限の80%（${newDaily}/${DAILY_LIMIT}）に達しました。`);
    }

    return true;
  }, []);

  // 使用量リセット（テスト用）
  const resetUsage = useCallback(() => {
    const today = new Date().toDateString();
    const thisWeek = getWeekKey(new Date());
    const thisMonth = getMonthKey(new Date());

    localStorage.removeItem(`api_usage_daily_${today}`);
    localStorage.removeItem(`api_usage_weekly_${thisWeek}`);
    localStorage.removeItem(`api_usage_monthly_${thisMonth}`);

    setUsage({ dailyUsage: 0, weeklyUsage: 0, monthlyUsage: 0 });
  }, []);

  useEffect(() => {
    loadUsageData();
  }, [loadUsageData]);

  return {
    usage,
    limits: { daily: DAILY_LIMIT, weekly: WEEKLY_LIMIT, monthly: MONTHLY_LIMIT },
    trackApiCall,
    resetUsage,
    isLimitReached: usage.dailyUsage >= DAILY_LIMIT || usage.weeklyUsage >= WEEKLY_LIMIT || usage.monthlyUsage >= MONTHLY_LIMIT
  };
};

// ヘルパー関数
function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week}`;
}

function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${month.toString().padStart(2, '0')}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}