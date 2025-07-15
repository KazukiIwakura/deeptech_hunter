
import { useReducer, useCallback } from 'react';
import {
    huntDeepTech,
    getTechExplanation,
    getOverseasStartups,
} from '../services/geminiService';
import type { DeepTech, Source, OverseasStartup, TechExplanationData } from '../types';
import type { GoogleGenAI } from '@google/genai';

// 1. State and Action Types
interface SearchState {
    searchQuery: string;
    isSearching: boolean;
    searchError: string | null;
    results: DeepTech[];
    sources: Source[];
    
    techExplanation: TechExplanationData | null;
    isExplanationLoading: boolean;
    explanationError: string | null;

    overseasStartups: OverseasStartup[];
    overseasStartupsSources: Source[];
    isOverseasStartupsLoading: boolean;
    overseasStartupsError: string | null;

    isSearchingMore: boolean;
    canLoadMore: boolean;
    noMoreResultsMessage: string;
}

type SearchAction = 
    | { type: 'RESET' }
    | { type: 'START_SEARCH'; payload: { query: string } }
    | { type: 'SET_EXPLANATION_RESULT'; payload: { data: TechExplanationData | null; error?: string } }
    | { type: 'SET_OVERSEAS_RESULT'; payload: { startups: OverseasStartup[]; sources: Source[]; error?: string } }
    | { type: 'SET_DOMESTIC_RESULT'; payload: { results: DeepTech[]; sources: Source[]; error?: string } }
    | { type: 'SEARCH_DONE' }
    | { type: 'START_SEARCH_MORE' }
    | { type: 'ADD_DOMESTIC_RESULTS'; payload: DeepTech[] }
    | { type: 'ADD_OVERSEAS_RESULTS'; payload: { startups: OverseasStartup[], sources: Source[] } }
    | { type: 'ADD_SOURCES'; payload: Source[] }
    | { type: 'SEARCH_MORE_DONE'; payload: { newResultsCount: number, newStartupsCount: number, hasError: boolean } };

// 2. Initial State
const initialState: SearchState = {
    searchQuery: '',
    isSearching: false,
    searchError: null,
    results: [],
    sources: [],
    techExplanation: null,
    isExplanationLoading: false,
    explanationError: null,
    overseasStartups: [],
    overseasStartupsSources: [],
    isOverseasStartupsLoading: false,
    overseasStartupsError: null,
    isSearchingMore: false,
    canLoadMore: true,
    noMoreResultsMessage: '',
};

// 3. Reducer
const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
    switch (action.type) {
        case 'RESET':
            return initialState;
        case 'START_SEARCH':
            return {
                ...initialState,
                searchQuery: action.payload.query,
                isSearching: true,
                isExplanationLoading: true,
                isOverseasStartupsLoading: true,
            };
        case 'SET_EXPLANATION_RESULT':
            return { ...state, isExplanationLoading: false, techExplanation: action.payload.data, explanationError: action.payload.error ?? null };
        case 'SET_OVERSEAS_RESULT':
            return { ...state, isOverseasStartupsLoading: false, overseasStartups: action.payload.startups, overseasStartupsSources: action.payload.sources, overseasStartupsError: action.payload.error ?? null };
        case 'SET_DOMESTIC_RESULT':
            return { ...state, results: action.payload.results, sources: action.payload.sources, searchError: action.payload.error ?? null };
        case 'SEARCH_DONE':
             return { ...state, isSearching: false };
        case 'START_SEARCH_MORE':
            return { ...state, isSearchingMore: true, noMoreResultsMessage: '' };
        case 'ADD_DOMESTIC_RESULTS':
            return { ...state, results: [...state.results, ...action.payload] };
        case 'ADD_OVERSEAS_RESULTS':
            return { ...state, overseasStartups: [...state.overseasStartups, ...action.payload.startups], overseasStartupsSources: [...state.overseasStartupsSources, ...action.payload.sources.filter(ns => !state.overseasStartupsSources.some(s => s.uri === ns.uri))] };
        case 'ADD_SOURCES':
             return { ...state, sources: [...state.sources, ...action.payload.filter(ns => !state.sources.some(s => s.uri === ns.uri))] };
        case 'SEARCH_MORE_DONE': {
            const { newResultsCount, newStartupsCount, hasError } = action.payload;
            let noMoreResultsMessage = state.noMoreResultsMessage;
            let canLoadMore = state.canLoadMore;
            if (!hasError && newResultsCount === 0 && newStartupsCount === 0) {
                canLoadMore = false;
                noMoreResultsMessage = 'これ以上関連性の高い情報は見つかりませんでした。';
            } else if (hasError) {
                noMoreResultsMessage = '追加調査中にエラーが発生しました。';
            }
            return { ...state, isSearchingMore: false, canLoadMore, noMoreResultsMessage };
        }
        default:
            return state;
    }
};

/**
 * Manages the state and logic for the tech search functionality.
 * This includes handling the initial parallel searches for domestic tech,
 * overseas startups, and tech explanations, as well as subsequent "search more" actions.
 * @param {GoogleGenAI | null} ai - The GoogleGenAI client instance.
 * @param {boolean} useDemoData - A flag to determine whether to use mock data or the live API.
 * @returns An object containing the search state and functions to manage search actions.
 */
export const useSearch = (ai: GoogleGenAI | null, useDemoData: boolean) => {
    const [state, dispatch] = useReducer(searchReducer, initialState);

    const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

    const startSearch = useCallback(async (query: string) => {
        if (!query.trim() || state.isSearching) return;
        if (!ai && !useDemoData) {
            dispatch({ type: 'SET_DOMESTIC_RESULT', payload: { results: [], sources: [], error: 'APIキーが設定されていません。' } });
            return;
        }

        dispatch({ type: 'START_SEARCH', payload: { query } });
        
        await Promise.allSettled([
            getTechExplanation(ai, query, useDemoData)
                .then(data => dispatch({ type: 'SET_EXPLANATION_RESULT', payload: { data } }))
                .catch(err => dispatch({ type: 'SET_EXPLANATION_RESULT', payload: { data: null, error: err.message } })),
            getOverseasStartups(ai, query, [], useDemoData)
                .then(data => dispatch({ type: 'SET_OVERSEAS_RESULT', payload: { ...data } }))
                .catch(err => dispatch({ type: 'SET_OVERSEAS_RESULT', payload: { startups: [], sources: [], error: err.message } })),
            huntDeepTech(ai, query, [], useDemoData)
                .then(data => dispatch({ type: 'SET_DOMESTIC_RESULT', payload: { ...data } }))
                .catch(err => dispatch({ type: 'SET_DOMESTIC_RESULT', payload: { results: [], sources: [], error: err.message } })),
        ]);
        
        dispatch({ type: 'SEARCH_DONE' });

    }, [state.isSearching, ai, useDemoData]);

    const handleSearchMore = useCallback(async () => {
        if (!state.searchQuery || state.isSearchingMore) return;
        if (!ai && !useDemoData) {
            dispatch({ type: 'SEARCH_MORE_DONE', payload: { newResultsCount: 0, newStartupsCount: 0, hasError: true } });
            return;
        }

        dispatch({ type: 'START_SEARCH_MORE' });

        const [domesticResult, overseasResult] = await Promise.allSettled([
             (async () => {
                try {
                    const { results: newTechs, sources: newSources } = await huntDeepTech(ai, state.searchQuery, state.results, useDemoData);
                    if (newSources.length > 0) dispatch({ type: 'ADD_SOURCES', payload: newSources });
                    if (newTechs.length > 0) dispatch({ type: 'ADD_DOMESTIC_RESULTS', payload: newTechs });
                    return newTechs;
                } catch (e) {
                    throw e;
                }
            })(),
            (async () => {
                 try {
                    const response = await getOverseasStartups(ai, state.searchQuery, state.overseasStartups, useDemoData);
                    if (response.startups.length > 0) dispatch({ type: 'ADD_OVERSEAS_RESULTS', payload: response });
                    return response;
                } catch (e) {
                    throw e;
                }
            })(),
        ]);

        const newResultsCount = domesticResult.status === 'fulfilled' ? domesticResult.value.length : 0;
        const newStartupsCount = overseasResult.status === 'fulfilled' ? overseasResult.value.startups.length : 0;
        const hasError = domesticResult.status === 'rejected' || overseasResult.status === 'rejected';

        dispatch({ type: 'SEARCH_MORE_DONE', payload: { newResultsCount, newStartupsCount, hasError } });

    }, [state.searchQuery, state.isSearchingMore, state.results, state.overseasStartups, ai, useDemoData]);

    return {
        state,
        reset,
        startSearch,
        handleSearchMore,
    };
};
