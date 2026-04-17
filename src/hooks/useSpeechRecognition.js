import { useState, useEffect } from 'react';

export function useSpeechRecognition(language = 'en-US') {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {
        if (!recognition) {
            setError('Speech recognition not supported in this browser');
            return;
        }
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language;
    }, [language, recognition]);

    const startListening = () => {
        if (!recognition) return;
        setError(null);
        setTranscript('');
        setIsListening(true);
        recognition.start();
    };

    const stopListening = () => {
        if (!recognition) return;
        setIsListening(false);
        recognition.stop();
    };

    if (recognition) {
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            setIsListening(false);
        };
        recognition.onerror = (event) => {
            setError(event.error);
            setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);
    }

    return { isListening, transcript, error, startListening, stopListening, isSupported: !!recognition };
}