import { useState } from 'react';

const Enter = () => {
    const [text, setText] = useState('');
    const [language, setLanguage] = useState('French');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const languages = [
        { code: 'French', name: 'French', flag: '🇫🇷' },
        { code: 'English', name: 'English', flag: '🇪g' },
        { code: 'Japanese', name: 'Japanese', flag: '🇯🇵' },
        { code: 'Arabic', name: 'Arabic', flag: '🇦🇪' },
        { code: 'Tamil', name: 'Tamil', flag: 'TN' }
    ];

    const handleTranslate = async () => {
        if (!text.trim()) {
            setError('Please enter some text to translate');
            return;
        }

        setLoading(true);
        setError(null);
        setTranslatedText('');

        try {
            const response = await fetch('http://localhost:5000/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, language }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Translation failed. Please try again.');
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setTranslatedText(data.translated_text);
        } catch (error) {
            setError(error.message);
            console.error('Translation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setText('');
        setTranslatedText('');
        setError(null);
    };

    const handleLanguageSelect = (langCode) => {
        setLanguage(langCode);
    };

    return (
        <div className="enter-text">
            <h2>AI Text Translator</h2>
            
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to translate... (e.g., Hello, how are you?)"
            ></textarea>

            <div className="controls">
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
                
                <button 
                    className="primary-btn" 
                    onClick={handleTranslate} 
                    disabled={loading || !text.trim()}
                >
                    {loading ? <span className="loading-spinner"></span> : '🚀'}
                    {loading ? 'Translating...' : 'Translate'}
                </button>
                
                <button 
                    className="secondary-btn" 
                    onClick={handleClear}
                    disabled={loading}
                >
                    Clear
                </button>
            </div>

            <div className="language-grid">
                {languages.map(lang => (
                    <div
                        key={lang.code}
                        className={`language-option ${language === lang.code ? 'selected' : ''}`}
                        onClick={() => handleLanguageSelect(lang.code)}
                    >
                        {lang.flag} {lang.name}
                    </div>
                ))}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {translatedText && (
                <div className="translated-text">
                    <h3>📝 Translation ({language})</h3>
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default Enter;