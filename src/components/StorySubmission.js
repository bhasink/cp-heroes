import React, { useState, useEffect, useRef } from 'react';

const StorySubmission = () => {
  const [storyText, setStoryText] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [justSubmittedPost, setJustSubmittedPost] = useState(null);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  
  const [previewPosts, setPreviewPosts] = useState([]);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewHasMore, setPreviewHasMore] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  const storyDisplayRef = useRef(null);
  const previewContentRef = useRef(null);
  
  const PAGE_SIZE = 20;
  const API_URL = 'https://www.centuryply.com/api/posts';
  const STATS_API_URL = 'https://www.centuryply.com/api/posts/stats';
  const BEARER_TOKEN = '66281054cfa5737ce9d148cf26afa4fd758d4559df1c63bee464b5d7fc2412ff1f5091688161d6b8caada5fd4401c8fcb29cc98a93a36734ca57cbb2b11cd9bbf36658dc6dcc88c6e22b0f8c3f7bca5c7e08d69e2c422cfc9c88ab3166f09b6c6f0338cb35cf88a596b23e5fe902950670a023a216887dbcc0a7b56466d02ffb';

  const fetchStats = async () => {
    try {
      const response = await fetch(STATS_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        mode: 'cors'
      });
      
      const responseText = await response.text();
      
      let result;
      try {
        if (responseText) {
          result = JSON.parse(responseText);
        }
      } catch (jsonError) {
        return;
      }
      
      if (!result) return;
      
      if (result.error) {
        return;
      }
      
      if (result.data) {
        setTotalWords(result.data.total_words || 0);
        setTotalParticipants(result.data.total_posts || 0);
      }
    } catch (error) {
    }
  };

  const fetchPosts = async (pageNumber = 1) => {
    if (loading || (!hasMore && pageNumber > 1)) return;
    
    setLoading(true);
    try {
      const url = `${API_URL}?sort=order:asc&pagination[page]=${pageNumber}&pagination[pageSize]=${PAGE_SIZE}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        mode: 'cors'
      });
      
      const responseText = await response.text();
      
      let result;
      try {
        if (responseText) {
          result = JSON.parse(responseText);
        }
      } catch (jsonError) {
        throw new Error('Invalid JSON response');
      }
      
      if (!result) {
        setHasMore(false);
        return;
      }
      
      if (result.error) {
        const errorMsg = typeof result.error === 'object' && result.error !== null ? 
          (result.error.message || 'Unknown error object') : String(result.error);
        throw new Error(`API error: ${errorMsg}`);
      }
      
      if (result.data) {
        if (Array.isArray(result.data)) {
          if (result.data.length === 0) {
            setHasMore(false);
          } else {
            setPosts(prevPosts => [...prevPosts, ...result.data]);
            
            if (result.meta && result.meta.pagination) {
              setHasMore(result.meta.pagination.pageCount > pageNumber);
            } else {
              setHasMore(false);
            }
          }
        } else {
          throw new Error('Invalid data format: expected an array');
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviewPosts = async (pageNumber = 1) => {
    if (previewLoading || (!previewHasMore && pageNumber > 1)) return;
    
    setPreviewLoading(true);
    try {
      const urlObj = new URL(API_URL);
      urlObj.searchParams.set('sort', 'order:asc');
      urlObj.searchParams.set('pagination[page]', pageNumber.toString());
      urlObj.searchParams.set('pagination[pageSize]', PAGE_SIZE.toString());
      const url = urlObj.toString();
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        mode: 'cors'
      });
      
      const responseText = await response.text();
      let result;
      try {
        if (responseText) {
          result = JSON.parse(responseText);
        }
      } catch (jsonError) {
        throw new Error('Invalid JSON response for preview');
      }
      
      if (!result) {
        setPreviewHasMore(false);
        return;
      }
      
      if (result.error) {
        const errorMsg = typeof result.error === 'object' && result.error !== null ? 
          (result.error.message || 'Unknown error object') : String(result.error);
        throw new Error(`Preview API error: ${errorMsg}`);
      }
      
      if (result.data && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          setPreviewHasMore(false);
        } else {
          setPreviewPosts(prevPosts => {
            const newPosts = pageNumber === 1 ? [...result.data] : [...prevPosts, ...result.data];
            return newPosts;
          });
          
          if (result.meta && result.meta.pagination) {
            const hasMore = result.meta.pagination.pageCount > pageNumber;
            setPreviewHasMore(hasMore);
          } else {
            const hasMore = result.data.length >= PAGE_SIZE;
            setPreviewHasMore(hasMore);
          }
        }
      }
    } catch (error) {
    } finally {
      setPreviewLoading(false);
    }
  };

 
  useEffect(() => {
    fetchPosts(1);
    fetchStats();
  }, []);

  const handleScroll = () => {
    if (storyDisplayRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = storyDisplayRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const handleStorySubmit = async () => {
    if (!storyText.trim()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const wordCount = storyText.trim().split(/\s+/).length;
      
      const requestBody = {
        data: {
          paragraph: storyText,
          word_count: wordCount
        }
      };
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify(requestBody),
        mode: 'cors'
      });
      
      const responseText = await response.text();
      
      let data;
      try {
        if (responseText) {
          data = JSON.parse(responseText);
        }
      } catch (jsonError) {
        throw new Error('Invalid response format');
      }
      
      if (!data) {
        throw new Error('Empty response from submission');
      }
      
      if (data.error) {
        throw new Error(`API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      
      const newPost = data.data || data;
      
      const localNewPost = {
        ...newPost,
        isJustSubmitted: true,
        submittedText: storyText,
        timestamp: new Date().getTime()
      };
      
      setPosts(prevPosts => [...prevPosts, localNewPost]);
      
      setJustSubmittedPost(localNewPost);
      setStoryText('');
      setShowThankYouPopup(true);
      
      setTimeout(() => {
        setShowThankYouPopup(false);
      }, 3000);
      
      fetchStats();
      
      if (storyDisplayRef.current) {
        storyDisplayRef.current.scrollTop = storyDisplayRef.current.scrollHeight;
      }
    } catch (error) {
      setSubmitError(`Failed to submit your story: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewPopupRef = useRef(null);
  const previewBtnRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewOpen &&
          previewPopupRef.current && 
          !previewPopupRef.current.contains(event.target) &&
          previewBtnRef.current && 
          !previewBtnRef.current.contains(event.target)) {
        setPreviewOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (justSubmittedPost) {
      if (storyDisplayRef.current) {
        storyDisplayRef.current.scrollTop = storyDisplayRef.current.scrollHeight;
      }
      
      const timer = setTimeout(() => {
        setJustSubmittedPost(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [justSubmittedPost]);

  const extractPostText = (post) => {
    if (!post) return '';
    
    let paragraphText = '';
    
    if (post.attributes && post.attributes.paragraph) {
      paragraphText = post.attributes.paragraph;
    } else if (post.paragraph) {
      paragraphText = post.paragraph;
    } else if (post.submittedText) {
      paragraphText = post.submittedText;
    } else if (typeof post === 'object') {
      const potentialFields = ['paragraph', 'text', 'content', 'message', 'body'];
      for (const field of potentialFields) {
        if (post[field]) {
          paragraphText = post[field];
          break;
        }
      }
      
      if (!paragraphText && post.data) {
        const data = post.data;
        for (const field of potentialFields) {
          if (data[field]) {
            paragraphText = data[field];
            break;
          }
        }
      }
      
      if (!paragraphText) {
        paragraphText = `Story #${post.id || 'New'}`;
      }
    }
    
    return paragraphText;
  };
  
  useEffect(() => {
    if (previewOpen) {
      setPreviewPage(1);
      setPreviewPosts([]);
      setPreviewHasMore(true);
      setPreviewLoading(true);
      
      setTimeout(() => {
        fetchPreviewPosts(1);
      }, 100);
    } else {
      setPreviewPage(1);
      setPreviewPosts([]);
    }
  }, [previewOpen]);
  
  useEffect(() => {
    if (previewOpen && previewContentRef.current) {
      const checkScrollPosition = () => {
        const element = previewContentRef.current;
        if (!element) return;
        
        const scrollPosition = element.scrollTop + element.clientHeight;
        const scrollThreshold = element.scrollHeight * 0.8;
        
        if (scrollPosition >= scrollThreshold && previewHasMore && !previewLoading) {
          setPreviewPage(prev => prev + 1);
        }
      };
      
      const scrollInterval = setInterval(checkScrollPosition, 500);
      
      return () => clearInterval(scrollInterval);
    }
  }, [previewOpen, previewHasMore, previewLoading]);
  
  useEffect(() => {
    if (previewOpen && previewPage > 1) {
      fetchPreviewPosts(previewPage);
    }
  }, [previewPage, previewOpen]);

  return (
    <>
      <section className="heroes_stories">
        <div className="story_box container">
          <img src="/images/envlop.png" alt="" className="envlop_img" />

          <div className="stories_head">
            <h1>Lay a Brick of Gratitude</h1>
            <p>Every word you write adds strength to a father's story. Your message will join thousands to form the world's longest open letter to dads who do it all.</p>
          </div>

          <div className="story_typer">
            <div 
              className="story_display" 
              ref={storyDisplayRef}
              onScroll={handleScroll}
            >
              {posts.map((post, index) => {
                const postId = post.id || index;
                const isJustSubmitted = post.isJustSubmitted || 
                  (justSubmittedPost && (post.id === justSubmittedPost.id || post.timestamp === justSubmittedPost.timestamp));
                
                let paragraphText = '';
                
                if (isJustSubmitted && post.submittedText) {
                  paragraphText = post.submittedText;
                } else {
                  if (post.attributes && post.attributes.paragraph) {
                    paragraphText = post.attributes.paragraph;
                  } else if (post.paragraph) {
                    paragraphText = post.paragraph;
                  } else if (typeof post === 'object') {
                    const potentialFields = ['paragraph', 'text', 'content', 'message', 'body'];
                    for (const field of potentialFields) {
                      if (post[field]) {
                        paragraphText = post[field];
                        break;
                      }
                    }
                    
                    if (!paragraphText && post.data) {
                      const data = post.data;
                      for (const field of potentialFields) {
                        if (data[field]) {
                          paragraphText = data[field];
                          break;
                        }
                      }
                    }
                  }
                }
                
                if (!paragraphText && typeof post === 'object') {
                  paragraphText = `Story #${index + 1}`;
                }
                
                return (
                  <p 
                    key={`post-${postId}-${index}`} 
                    className={`story-post ${isJustSubmitted ? 'story-post-new' : ''}`}
                  >
                    {paragraphText || `Story #${index + 1}`}
                  </p>
                );
              })}
              
              {loading && <p className="loading-posts">Loading more stories...</p>}
              {!loading && !hasMore && posts.length > 0 && (
                <p className="no-more-posts">You've reached the end of all stories</p>
              )}
              {!loading && posts.length === 0 && (
                <p className="no-posts">No stories yet. Be the first to contribute!</p>
              )}
            </div>

            <div className="type_story_box">
                <input 
                  type="text" 
                  className="type_story" 
                  placeholder="Type your story here"
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && handleStorySubmit()}
                  disabled={isSubmitting}
                />
                <button 
                  className="story_submit" 
                  onClick={handleStorySubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="submit-loader-container">
                      <svg className="submit-loader-svg" viewBox="0 0 50 50">
                        <circle className="submit-loader-circle" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                      </svg>
                    </div>
                  ) : (
                    <img src="/images/submit-icon.png" alt="" />
                  )}
                </button>
              </div>
            
            {submitError && <div className="error-message">{submitError}</div>}
          </div>

          <div className="story_preview_btn" ref={previewBtnRef} onClick={() => setPreviewOpen(true)}>Preview</div>
        </div>


        	<div className="stories_counter container">

            <div className="word_count">
              <h3>Word Count: </h3>
              <span className="total_word">{totalWords}</span>
            </div>

            <div className="part_count">
              <h3>No. of Participants: </h3>
              <span className="total_part">{totalParticipants}</span>
            </div>

          </div>

      </section>

      <div className={`story_preview_popup ${previewOpen ? 'open_preview' : ''}`} ref={previewPopupRef}>
        <div className="story_preview_box">	
          <img src="/images/open_envlop.png" alt="" className="popup_envlp" />
          <div className="close_preview" onClick={() => setPreviewOpen(false)}>X</div>
          <div 
            className="preview_content" 
            ref={previewContentRef} 
            onScroll={(e) => {
              if (window._scrollTimeout) {
                clearTimeout(window._scrollTimeout);
              }
              
              window._scrollTimeout = setTimeout(() => {
                const element = e.currentTarget;
                const scrollPosition = element.scrollTop + element.clientHeight;
                const scrollThreshold = element.scrollHeight * 0.8;
                
                if (scrollPosition >= scrollThreshold && previewHasMore && !previewLoading) {
                  setPreviewPage(prevPage => prevPage + 1);
                }
              }, 100);
            }}
          >
            {previewPosts.length > 0 ? (
              previewPosts.map((post, index) => {
                const isJustSubmitted = justSubmittedPost && 
                  (post.id === justSubmittedPost.id || 
                   post.timestamp === justSubmittedPost.timestamp);
                   
                return (
                  <p 
                    key={`preview-${post.id || index}`}
                    className={`preview-post ${isJustSubmitted ? 'preview-post-new' : ''}`}
                  >
                    {extractPostText(post)}
                  </p>
                );
              })
            ) : !previewLoading ? (
              <p className="no-posts-preview">No stories have been shared yet. Be the first to contribute!</p>
            ) : null}
            
            {previewLoading && previewPosts.length > 0 && (
              <p className="loading-preview-indicator">
                Loading more stories...
              </p>
            )}
            
            {previewLoading && previewPosts.length === 0 && (
              <p className="loading-preview">Loading stories...</p>
            )}
            <div className="preview-scroll-spacer" style={{ height: '20px', width: '100%' }}></div>
          </div>
        </div>
      </div>
      
      {showThankYouPopup && (
        <div className="thank-you-popup-overlay">
          <div className="thank-you-popup">
            <div className="thank-you-popup-content">
              <div className="thank-you-popup-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 12.5L10.5 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>Thank You!</h2>
              <p>Your story has been successfully added to our wall of gratitude.</p>
              <button className="thank-you-popup-close" onClick={() => setShowThankYouPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StorySubmission;