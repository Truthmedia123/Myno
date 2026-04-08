import { useState, useEffect, useCallback } from 'react';
import { getPhonemeTip } from '@/curriculum/shared/phonemeGuide';

/**
 * Hook to manage phoneme feedback toast.
 * @param {Object} correction - AI correction object with { mistake, fix, phonemeTip? }
 * @param {string} userLang - Target language code (e.g., 'es', 'en')
 * @returns {Object} { showToast: boolean, tip: string, phonemeName: string, dismiss: function }
 */
export function usePhonemeFeedback(correction, userLang = 'en') {
    const [showToast, setShowToast] = useState(false);
    const [tip, setTip] = useState('');
    const [phonemeName, setPhonemeName] = useState('');

    const dismiss = useCallback(() => {
        setShowToast(false);
        setTip('');
        setPhonemeName('');
    }, []);

    useEffect(() => {
        if (!correction?.phonemeTip) {
            dismiss();
            return;
        }

        // Extract phoneme name from correction.phonemeTip (could be a string like "Rolled 'r'")
        const phonemeKey = correction.phonemeTip;
        const phonemeTipText = getPhonemeTip(phonemeKey, userLang);

        setPhonemeName(phonemeKey);
        setTip(phonemeTipText);
        setShowToast(true);

        const timer = setTimeout(() => {
            dismiss();
        }, 5000);

        return () => clearTimeout(timer);
    }, [correction, userLang, dismiss]);

    return { showToast, tip, phonemeName, dismiss };
}