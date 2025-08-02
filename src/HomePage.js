import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage({ 
  isDarkMode = false, 
  toggleTheme = () => {}, 
  user, 
  subscription, 
  getUserTier, 
  canAccessFeature, 
  login, 
  logout, 
  upgradeSubscription, 
  setShowLoginModal, 
  setShowUpgradeModal 
}) {
  // Always use light theme
  const theme = {
    background: '#ffffff',
    text: '#1a1a1a',
    primary: '#6366f1',
    secondary: '#f3f4f6',
    accent: '#fbbf24',
    muted: '#6b7280',
    border: '#e5e7eb',
    card: '#ffffff',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  const [faqOpen, setFaqOpen] = React.useState(null);
  const [text, setText] = useState('');
  const [humanizedText, setHumanizedText] = useState(''); // NEW: separate state for humanized text
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [selectedTier, setSelectedTier] = useState(() => getUserTier ? getUserTier() : 'basic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [writingStyle, setWritingStyle] = useState('professional');
  const [tone, setTone] = useState('neutral');
  const [targetAudience, setTargetAudience] = useState('general');
  const textareaRef = useRef(null);

  // Update selected tier when user subscription changes
  useEffect(() => {
    if (getUserTier) {
      setSelectedTier(getUserTier());
    }
  }, [getUserTier, subscription]);

  const faqs = [
    {
      q: 'What is Notecraft Pro?',
      a: 'Notecraft Pro is the world\'s most advanced AI humanizer, transforming AI-generated content into authentic, human-like writing.'
    },
    {
      q: 'How does it work?',
      a: 'Our enhanced model and built-in AI detector ensure your content passes leading AI detection tools and reads naturally.'
    },
    {
      q: 'Will my writing lose its original meaning?',
      a: 'No. Notecraft Pro preserves your message while making it sound more human.'
    },
    {
      q: 'Can I use Notecraft Pro for non-AI writing?',
      a: 'Absolutely! Our tool improves any text, AI-generated or not.'
    },
    {
      q: 'What platforms and detectors are compatible?',
      a: 'Notecraft Pro works with content from any AI generator and is tested on GPTZero, Copyleaks, Originality, and more.'
    }
  ];

  // Calculate text statistics
  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const readingTimeMinutes = Math.ceil(words / 200); // Average reading speed
    
    setWordCount(words);
    setCharCount(chars);
    setReadingTime(readingTimeMinutes);
    
    // Simulate AI detection score (in real app, this would be API call)
    if (text.length > 50) {
      const randomScore = Math.floor(Math.random() * 40) + 10; // 10-50% AI score
      setAiScore(randomScore);
    } else {
      setAiScore(0);
    }
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const clearText = () => {
    setText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
  };

  const handleHumanize = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    try {
      // Use the new FastAPI backend
      const apiUrl = process.env.REACT_APP_API_URL || 'https://your-render-url.onrender.com';
      const response = await fetch(`${apiUrl}/humanize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-secret'
        },
        body: JSON.stringify({
          text: text
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.humanized) {
        setHumanizedText(result.humanized);
        
        // Show success message
        alert('Text humanized successfully!');
      } else {
        throw new Error('Failed to humanize text');
      }
      
    } catch (error) {
      console.error('Humanize error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getTierFeatures = (tier) => {
    const features = {
      basic: {
        wordLimit: 500,
        features: ['Basic humanization', 'Word count', 'Reading time'],
        color: theme.primary
      },
      pro: {
        wordLimit: 2000,
        features: ['Advanced humanization', 'Style customization', 'Tone adjustment', 'AI detection', 'Export options'],
        color: theme.accent
      },
      ultra: {
        wordLimit: 10000,
        features: ['Ultra humanization', 'All Pro features', 'Bulk processing', 'Priority support', 'Custom styles'],
        color: '#8b5cf6'
      }
    };
    return features[tier];
  };

  const currentTier = getTierFeatures(selectedTier);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '1rem 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: 'white' 
          }}>
            Notecraft Pro
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem' 
          }}>
            <Link 
              to="/notepad" 
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Notepad
            </Link>
            <button
              onClick={() => setShowUpgradeModal(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Pricing
            </button>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Welcome, {user.name}
                </span>
                <button
                  onClick={logout}
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    color: '#667eea',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = '#764ba2';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.color = '#667eea';
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  color: '#667eea',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#764ba2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.color = '#667eea';
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '120px', paddingBottom: '60px', textAlign: 'center', background: theme.gradient, color: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', marginBottom: '1.2rem', lineHeight: '1.1' }}>
            Writing, Perfected.<br />
            Humanize AI with <span style={{ color: theme.accent }}>Notecraft Pro</span>
          </h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.95 }}>
            Turn AI into natural human writing with the world's most advanced AI Humanizer.
          </p>
          
          {/* Plan Selection */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {['basic', 'pro', 'ultra'].map((tier) => {
                const canAccess = canAccessFeature ? canAccessFeature(tier) : true;
                const isSelected = selectedTier === tier;
                
                return (
                  <button
                    key={tier}
                    onClick={() => {
                      if (canAccess) {
                        setSelectedTier(tier);
                      } else if (tier === 'pro' || tier === 'ultra') {
                        setShowUpgradeModal(true);
                      }
                    }}
                    style={{
                      background: isSelected ? getTierFeatures(tier).color : 'rgba(255,255,255,0.1)',
                      color: isSelected ? '#1a1a1a' : 'white',
                      border: '2px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      fontWeight: 'bold',
                      cursor: canAccess ? 'pointer' : 'pointer',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize',
                      opacity: canAccess ? 1 : 0.6,
                      position: 'relative'
                    }}
                  >
                    {tier}
                    {!canAccess && (tier === 'pro' || tier === 'ultra') && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff6b6b',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontWeight: 'bold'
                      }}>
                        $
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {currentTier.wordLimit} words • {currentTier.features.join(' • ')}
              {!user && (
                <span style={{ marginLeft: '1rem', color: '#ff6b6b' }}>
                  Sign in to access Pro & Ultra features
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
              {/* Enhanced Text Area */}
              <div style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                border: '2px solid rgba(255,255,255,0.2)',
                padding: '1rem',
                backdropFilter: 'blur(10px)'
              }}>
                <textarea 
                  ref={textareaRef}
                  placeholder="Paste your AI-generated text here to humanize it..." 
                  value={text}
                  onChange={handleTextChange}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    padding: '1rem', 
                    borderRadius: '0.5rem', 
                    border: 'none',
                    fontSize: '1.1rem', 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    color: '#1a1a1a',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s',
                    lineHeight: '1.6',
                    boxSizing: 'border-box'
                  }} 
                />
                
                {/* Text Statistics */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>Words: {wordCount}/{currentTier.wordLimit}</span>
                    <span>Characters: {charCount}</span>
                    <span>Reading time: {readingTime} min</span>
                    {aiScore > 0 && (
                      <span style={{ 
                        color: aiScore > 30 ? theme.error : aiScore > 15 ? theme.warning : theme.success 
                      }}>
                        AI Score: {aiScore}%
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={copyText}
                      disabled={!text}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        color: 'white',
                        cursor: text ? 'pointer' : 'not-allowed',
                        fontSize: '0.8rem'
                      }}
                    >
                      Copy
                    </button>
                    <button
                      onClick={clearText}
                      disabled={!text}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        borderRadius: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        color: 'white',
                        cursor: text ? 'pointer' : 'not-allowed',
                        fontSize: '0.8rem'
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Options (Pro & Ultra) */}
              {(selectedTier === 'pro' || selectedTier === 'ultra') && canAccessFeature && canAccessFeature(selectedTier) && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '0.25rem',
                      padding: '0.5rem 1rem',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                  </button>
                  
                  {showAdvancedOptions && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Writing Style</label>
                        <select
                          value={writingStyle}
                          onChange={(e) => setWritingStyle(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid rgba(255,255,255,0.3)',
                            background: 'rgba(255,255,255,0.9)',
                            color: '#1a1a1a'
                          }}
                        >
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="academic">Academic</option>
                          <option value="creative">Creative</option>
                          <option value="technical">Technical</option>
                        </select>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tone</label>
                        <select
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid rgba(255,255,255,0.3)',
                            background: 'rgba(255,255,255,0.9)',
                            color: '#1a1a1a'
                          }}
                        >
                          <option value="neutral">Neutral</option>
                          <option value="friendly">Friendly</option>
                          <option value="formal">Formal</option>
                          <option value="enthusiastic">Enthusiastic</option>
                          <option value="confident">Confident</option>
                        </select>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Target Audience</label>
                        <select
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid rgba(255,255,255,0.3)',
                            background: 'rgba(255,255,255,0.9)',
                            color: '#1a1a1a'
                          }}
                        >
                          <option value="general">General</option>
                          <option value="experts">Experts</option>
                          <option value="beginners">Beginners</option>
                          <option value="students">Students</option>
                          <option value="professionals">Professionals</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upgrade Prompt for Non-Subscribers */}
              {(selectedTier === 'pro' || selectedTier === 'ultra') && canAccessFeature && !canAccessFeature(selectedTier) && (
                <div style={{
                  marginTop: '1rem',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'white', marginBottom: '12px', fontWeight: 'bold' }}>
                    🔒 {selectedTier.toUpperCase()} Features Require Subscription
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '16px', fontSize: '0.9rem' }}>
                    Upgrade to {selectedTier} to access advanced features like AI detection, export options, and style customization.
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    style={{
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      padding: '8px 24px',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    Upgrade Now
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <button 
                  onClick={handleHumanize}
                  disabled={!text.trim() || isProcessing}
                  style={{ 
                    background: isProcessing ? theme.muted : theme.accent, 
                    color: '#1a1a1a', 
                    border: 'none', 
                    borderRadius: '0.5rem', 
                    padding: '1rem 3rem', 
                    fontWeight: 'bold', 
                    fontSize: '1.2rem', 
                    cursor: text.trim() && !isProcessing ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    opacity: text.trim() && !isProcessing ? 1 : 0.6
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Humanize Text'}
                </button>
              </div>

              {/* Humanized Text Output */}
              {humanizedText && (
                <div style={{ marginTop: '2rem' }}>
                  <div style={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    border: '2px solid rgba(255,255,255,0.2)',
                    padding: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      padding: '0.5rem 1rem',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{ fontWeight: 'bold', color: 'white' }}>✨ Humanized Result:</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => navigator.clipboard.writeText(humanizedText)}
                          style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => setHumanizedText('')}
                          style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <textarea 
                      value={humanizedText}
                      readOnly
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        padding: '1rem', 
                        borderRadius: '0.5rem', 
                        border: 'none',
                        fontSize: '1.1rem', 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        color: '#1a1a1a',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'all 0.2s',
                        lineHeight: '1.6',
                        boxSizing: 'border-box'
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section style={{ padding: '60px 0', background: theme.secondary }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2.5rem' }}>Humanize AI text in three simple steps:</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div style={{ background: theme.card, borderRadius: '1rem', padding: '2rem', border: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>1️⃣</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Copy AI-generated text</div>
              <div style={{ color: theme.muted }}>Notecraft Pro works with text from ChatGPT, Claude, Deepseek, Gemini, or any other AI content generator.</div>
            </div>
            <div style={{ background: theme.card, borderRadius: '1rem', padding: '2rem', border: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>2️⃣</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Paste into Notecraft Pro</div>
              <div style={{ color: theme.muted }}>Our tool refines and transforms your AI-generated content to sound more human.</div>
            </div>
            <div style={{ background: theme.card, borderRadius: '1rem', padding: '2rem', border: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>3️⃣</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Click Humanize to transform your text</div>
              <div style={{ color: theme.muted }}>Our advanced AI humanizer is tested on tools like GPTZero, Copyleaks, and Originality.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section style={{ padding: '60px 0', background: theme.background }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Produce genuine, human-sounding text in seconds.</h2>
          <p style={{ fontSize: '1.1rem', color: theme.muted, marginBottom: '2rem' }}>
            Notecraft Pro’s AI humanizer tool transforms AI text into authentic, human-like content. Extensively tested on detectors such as GPTZero, Copyleaks, and Quillbot to ensure your content sounds human. Trusted by writers around the world for high-quality writing.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 0', background: theme.secondary }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2.5rem' }}>Why Notecraft Pro?</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '2rem', 
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            placeItems: 'center'
          }}>
            {/* First row - 3 cards */}
            <div style={{ 
              background: theme.card, 
              borderRadius: '1rem', 
              padding: '2rem', 
              border: `1px solid ${theme.border}`, 
              textAlign: 'center',
              height: 'fit-content',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Built-in AI Detection</div>
              <div style={{ color: theme.muted, lineHeight: '1.6' }}>Notecraft Pro's trusted AI Detector ensures your text is human. If it doesn't pass, you can retry your request for free.</div>
            </div>
            <div style={{ 
              background: theme.card, 
              borderRadius: '1rem', 
              padding: '2rem', 
              border: `1px solid ${theme.border}`, 
              textAlign: 'center',
              height: 'fit-content',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Effortlessly Humanize AI Text</div>
              <div style={{ color: theme.muted, lineHeight: '1.6' }}>Refine AI-generated text into authentic, human-quality writing. Paste from any AI platform—our tool enhances it with natural phrasing and emotional depth.</div>
            </div>
            <div style={{ 
              background: theme.card, 
              borderRadius: '1rem', 
              padding: '2rem', 
              border: `1px solid ${theme.border}`, 
              textAlign: 'center',
              height: 'fit-content',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Engage Your Readers in Seconds</div>
              <div style={{ color: theme.muted, lineHeight: '1.6' }}>Instantly improve AI text and protect your authenticity. Notecraft Pro transforms any AI text into human-like content—extensively tested on leading detectors.</div>
            </div>
                         {/* Second row - 3 cards for balance */}
             <div style={{ 
               background: theme.card, 
               borderRadius: '1rem', 
               padding: '2rem', 
               border: `1px solid ${theme.border}`, 
               textAlign: 'center',
               height: 'fit-content',
               minHeight: '200px',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center'
             }}>
               <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Create Engaging Content</div>
               <div style={{ color: theme.muted, lineHeight: '1.6' }}>Produce human-quality content with Notecraft Pro's advanced AI humanizer—text that reads naturally, even on leading AI detectors.</div>
             </div>
             <div style={{ 
               background: theme.card, 
               borderRadius: '1rem', 
               padding: '2rem', 
               border: `1px solid ${theme.border}`, 
               textAlign: 'center',
               height: 'fit-content',
               minHeight: '200px',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center'
             }}>
               <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Quality Humanizer Output</div>
               <div style={{ color: theme.muted, lineHeight: '1.6' }}>No more grammatical errors or low-quality output. Notecraft Pro delivers the highest quality outputs in the industry.</div>
             </div>
             <div style={{ 
               background: theme.card, 
               borderRadius: '1rem', 
               padding: '2rem', 
               border: `1px solid ${theme.border}`, 
               textAlign: 'center',
               height: 'fit-content',
               minHeight: '200px',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center'
             }}>
               <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Advanced Analytics</div>
               <div style={{ color: theme.muted, lineHeight: '1.6' }}>Track your writing performance with detailed analytics and insights to improve your content quality over time.</div>
             </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '60px 0', background: theme.background }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2.5rem' }}>Choose the plan that’s right for you.</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            {[
              { name: 'Basic', price: '$0', period: 'Free tier', features: ['500 words per request', 'Basic humanization', 'Word count & reading time', 'Auto-save'], badge: 'Best for light users' },
              { name: 'Pro', price: '$29.99', period: 'Per month', features: ['2000 words per request', 'Advanced humanization', 'AI detection', 'Export options', 'Style customization'], badge: 'Best for most users', highlight: true },
              { name: 'Ultra', price: '$59.99', period: 'Per month', features: ['10000 words per request', 'Ultra humanization', 'All Pro features', 'Bulk processing', 'Priority support'], badge: 'Best for power users' }
            ].map((plan, i) => (
              <div key={i} style={{ background: plan.highlight ? theme.primary : theme.card, color: plan.highlight ? '#fff' : theme.text, borderRadius: '1rem', padding: '2rem', minWidth: '260px', maxWidth: '320px', border: `2px solid ${plan.highlight ? theme.primary : theme.border}`, boxShadow: plan.highlight ? '0 4px 24px rgba(99,102,241,0.15)' : 'none', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', background: theme.accent, color: '#1a1a1a', borderRadius: '1rem', padding: '0.3rem 1.2rem', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>{plan.badge}</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '0.5rem', marginTop: '1.5rem' }}>{plan.name}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{plan.price}</div>
                <div style={{ fontSize: '1rem', color: plan.highlight ? '#e0e7ff' : theme.muted, marginBottom: '1.2rem' }}>{plan.period}</div>
                <ul style={{ textAlign: 'left', padding: 0, margin: 0, listStyle: 'none', marginBottom: '1.2rem' }}>
                  {plan.features.map((f, j) => <li key={j} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ color: theme.accent }}>✔️</span> {f}</li>)}
                </ul>
                <button style={{ background: theme.accent, color: '#1a1a1a', border: 'none', borderRadius: '0.5rem', padding: '0.8rem 1.5rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', width: '100%' }}>Subscribe</button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', color: theme.muted, marginTop: '2rem', fontSize: '1rem' }}>
            Not ready to commit? All users can submit unlimited requests for free, up to 500 words each.
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{ padding: '60px 0', background: theme.secondary }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>“</div>
          <div style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1rem' }}>
            As a digital marketer, my writing gains warmth and personality, as if I’d spent days perfecting it.
          </div>
          <div style={{ fontWeight: 'bold', color: theme.primary }}>— Yuna K.</div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '60px 0', background: theme.background }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2.5rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: theme.card, borderRadius: '1rem', padding: '1.5rem 2rem', border: `1px solid ${theme.border}`, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', color: theme.primary }}>{faq.q}</div>
                <div style={{ color: theme.muted, maxHeight: faqOpen === i ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.3s', fontSize: '1rem' }}>{faqOpen === i && faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '60px 0', background: theme.gradient, color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Humanize your AI writing with Notecraft Pro.</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
            Transform your AI-generated text into authentic, human-quality content—trusted by professionals, creators, and marketers worldwide.
          </p>
          <Link to="/notepad" style={{ background: theme.accent, color: '#1a1a1a', padding: '1rem 2rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block', transition: 'all 0.2s' }}>Start Humanizing Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: theme.card, borderTop: `1px solid ${theme.border}`, padding: '3rem 0 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.primary, marginBottom: '1rem' }}>Notecraft Pro</div>
          <p style={{ color: theme.muted, marginBottom: '2rem' }}>
            The ultimate AI-powered humanizer for professionals and creators.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link to="/notepad" style={{ color: theme.text, textDecoration: 'none', fontWeight: '500' }}>Try Now</Link>
            <Link to="/privacy" style={{ color: theme.text, textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: theme.text, textDecoration: 'none', fontWeight: '500' }}>Terms of Service</Link>
          </div>
          <div style={{ color: theme.muted, fontSize: '0.9rem' }}>
            © {new Date().getFullYear()} Notecraft Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
