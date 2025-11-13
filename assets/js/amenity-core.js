// Amenity Core Application Logic
class AmenityApp {
    constructor() {
        this.currentUser = {
            id: 'user_' + Date.now(),
            username: 'member_user',
            displayName: 'Member User',
            church: 'Altar Life International Ministries',
            subscription: 'premium',
            followers: 234,
            following: 167,
            posts: 89
        };
        
        this.currentFeed = 'posts';
        this.analytics = new AmenityAnalytics();
        
        this.init();
    }

    init() {
        console.log('🚀 Amenity App Initialized');
        this.setupEventListeners();
        this.loadUserData();
        this.trackPageLoad();
    }

    setupEventListeners() {
        // Scroll tracking for infinite feed
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
                this.loadMoreContent();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    loadUserData() {
        // In production, this would fetch from API
        const userData = localStorage.getItem('amenity_user');
        if (userData) {
            this.currentUser = { ...this.currentUser, ...JSON.parse(userData) };
        }
    }

    trackPageLoad() {
        this.analytics.track('page_load', {
            page: 'main_feed',
            user_id: this.currentUser.id,
            church: this.currentUser.church,
            timestamp: Date.now()
        });
    }

    // Feed Management
    switchFeed(feedType) {
        // Update active button
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Hide all feeds
        document.querySelectorAll('.posts-feed, .video-feed').forEach(feed => {
            feed.style.display = 'none';
        });

        // Show selected feed
        this.currentFeed = feedType;
        switch(feedType) {
            case 'posts':
                document.getElementById('posts-feed').style.display = 'block';
                break;
            case 'videos':
                document.getElementById('video-feed').style.display = 'block';
                this.loadVideoFeed();
                break;
            case 'live':
                this.showLiveStreams();
                break;
            case 'creators':
                this.showCreatorDirectory();
                break;
        }

        this.analytics.track('feed_switch', {
            feed_type: feedType,
            user_id: this.currentUser.id
        });
    }

    loadVideoFeed() {
        const videoFeed = document.getElementById('video-feed');
        if (videoFeed.children.length === 1) {
            // Load more video content
            const moreVideos = this.generateVideoContent();
            videoFeed.insertAdjacentHTML('beforeend', moreVideos);
        }
    }

    generateVideoContent() {
        return `
            <div class="video-item">
                <header class="post-header">
                    <div class="post-user-info">
                        <img src="https://via.placeholder.com/32x32/10b981/ffffff?text=S" alt="Sara Baker" class="post-avatar">
                        <div>
                            <a href="#" class="post-username">sarabaker_youth</a>
                            <div class="post-time">Youth Ministry Highlight</div>
                        </div>
                    </div>
                </header>
                
                <div class="video-player">
                    <button class="play-button" onclick="app.playVideo(2)">▶</button>
                </div>
                
                <div class="post-actions">
                    <div class="post-actions-left">
                        <button class="action-btn" onclick="app.toggleVideoLike(this)">
                            <svg class="action-icon" viewBox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="app.showVideoComments(2)">
                            <svg class="action-icon" viewBox="0 0 24 24">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="app.shareVideo(2)">
                            <svg class="action-icon" viewBox="0 0 24 24">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16,6 12,2 8,6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="post-likes">
                    <strong>456 likes</strong>
                </div>
                
                <div class="post-caption">
                    <strong>sarabaker_youth</strong> Behind the scenes of our youth ministry. Watch how we're building the next generation of faith leaders!
                </div>
            </div>
        `;
    }

    loadMoreContent() {
        if (this.currentFeed === 'posts') {
            this.loadMorePosts();
        } else if (this.currentFeed === 'videos') {
            this.loadMoreVideos();
        }
    }

    loadMorePosts() {
        // Simulate loading more posts
        const postsData = [
            {
                username: 'faith_finance',
                displayName: 'Faith & Finance',
                time: '6 hours ago',
                content: 'Biblical principles for financial stewardship. Join our workshop series!',
                likes: 156,
                comments: 23
            },
            {
                username: 'altarlife_worship',
                displayName: 'Altar Life Worship',
                time: '8 hours ago',
                content: 'New worship song premiere this Sunday. Come experience the presence of God!',
                likes: 298,
                comments: 45
            }
        ];

        const postsHTML = postsData.map(post => this.generatePostHTML(post)).join('');
        document.getElementById('posts-feed').insertAdjacentHTML('beforeend', postsHTML);
    }

    generatePostHTML(postData) {
        return `
            <article class="post">
                <header class="post-header">
                    <div class="post-user-info">
                        <img src="https://via.placeholder.com/32x32/6366f1/ffffff?text=${postData.username.charAt(0).toUpperCase()}" alt="${postData.displayName}" class="post-avatar">
                        <div>
                            <a href="#" class="post-username">${postData.username}</a>
                            <div class="post-time">${postData.time}</div>
                        </div>
                    </div>
                    <button class="post-options" onclick="app.showPostOptions()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="1.5"/>
                            <circle cx="6" cy="12" r="1.5"/>
                            <circle cx="18" cy="12" r="1.5"/>
                        </svg>
                    </button>
                </header>
                
                <div class="post-content">
                    <img src="https://via.placeholder.com/600x600/f3f4f6/374151?text=${encodeURIComponent(postData.displayName)}" alt="${postData.displayName}" class="post-image">
                </div>
                
                <div class="post-actions">
                    <div class="post-actions-left">
                        <button class="action-btn" onclick="app.toggleLike(this)">
                            <svg class="action-icon" viewBox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="app.showComments()">
                            <svg class="action-icon" viewBox="0 0 24 24">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="app.sharePost()">
                            <svg class="action-icon" viewBox="0 0 24 24">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16,6 12,2 8,6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                        </button>
                    </div>
                    <button class="action-btn" onclick="app.savePost()">
                        <svg class="action-icon" viewBox="0 0 24 24">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="post-likes">
                    <strong>${postData.likes} likes</strong>
                </div>
                
                <div class="post-caption">
                    <strong>${postData.username}</strong> ${postData.content}
                </div>
                
                <div class="post-comments">
                    <button class="view-comments" onclick="app.viewAllComments()">View all ${postData.comments} comments</button>
                </div>
            </article>
        `;
    }

    // Interaction Handlers
    toggleLike(button) {
        const icon = button.querySelector('.action-icon');
        const post = button.closest('.post');
        const likesElement = post.querySelector('.post-likes strong');
        
        const isLiked = icon.classList.contains('liked');
        const currentLikes = parseInt(likesElement.textContent.split(' ')[0]);
        
        if (isLiked) {
            icon.classList.remove('liked');
            likesElement.textContent = `${currentLikes - 1} likes`;
        } else {
            icon.classList.add('liked');
            likesElement.textContent = `${currentLikes + 1} likes`;
            this.createLikeAnimation(button);
        }

        this.analytics.track('post_like', {
            liked: !isLiked,
            user_id: this.currentUser.id,
            post_type: 'image'
        });
    }

    toggleVideoLike(button) {
        const icon = button.querySelector('.action-icon');
        const video = button.closest('.video-item');
        const likesElement = video.querySelector('.post-likes strong');
        
        const isLiked = icon.classList.contains('liked');
        const currentLikes = parseInt(likesElement.textContent.split(' ')[0].replace(',', ''));
        
        if (isLiked) {
            icon.classList.remove('liked');
            likesElement.textContent = `${(currentLikes - 1).toLocaleString()} likes`;
        } else {
            icon.classList.add('liked');
            likesElement.textContent = `${(currentLikes + 1).toLocaleString()} likes`;
            this.createLikeAnimation(button);
        }

        this.analytics.track('video_like', {
            liked: !isLiked,
            user_id: this.currentUser.id,
            content_type: 'video'
        });
    }

    createLikeAnimation(button) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: absolute;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: heartFloat 1s ease-out forwards;
        `;
        
        button.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }

    playVideo(videoId) {
        this.analytics.track('video_play', {
            video_id: videoId,
            user_id: this.currentUser.id
        });

        this.showModal('Video Player', `
            <div style="aspect-ratio: 16/9; background: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;">
                ▶️
            </div>
            <div style="margin-top: 16px;">
                <h3>Video Player</h3>
                <p>Full video streaming system will be implemented with:</p>
                <ul style="text-align: left; margin: 12px 0;">
                    <li>HD video streaming</li>
                    <li>Real-time comments</li>
                    <li>Live viewer count</li>
                    <li>Quality selection</li>
                    <li>Picture-in-picture mode</li>
                </ul>
            </div>
        `);
    }

    showComments() {
        this.showModal('Comments', `
            <div class="comments-container">
                <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 12px; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <img src="https://via.placeholder.com/24x24/6366f1/ffffff?text=M" alt="" style="width: 24px; height: 24px; border-radius: 50%;">
                        <strong style="font-size: 14px;">michael_johnson</strong>
                        <span style="font-size: 12px; color: var(--text-secondary);">2h</span>
                    </div>
                    <p style="font-size: 14px; margin: 0;">Amazing message! This really spoke to my heart. Thank you Pastor Rod 🙏</p>
                </div>
                
                <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 12px; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <img src="https://via.placeholder.com/24x24/10b981/ffffff?text=S" alt="" style="width: 24px; height: 24px; border-radius: 50%;">
                        <strong style="font-size: 14px;">sarah_williams</strong>
                        <span style="font-size: 12px; color: var(--text-secondary);">1h</span>
                    </div>
                    <p style="font-size: 14px; margin: 0;">Sharing this with my family! Such powerful truth ✨</p>
                </div>
                
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <input type="text" placeholder="Add a comment..." style="flex: 1; padding: 8px 12px; border: 1px solid var(--border-medium); border-radius: 20px; font-size: 14px;">
                    <button onclick="app.postComment()" style="background: var(--accent); color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">Post</button>
                </div>
            </div>
        `);
    }

    showVideoComments(videoId) {
        this.showComments(); // Same interface for now
        this.analytics.track('video_comments_open', { video_id: videoId });
    }

    postComment() {
        const input = document.querySelector('#modal input');
        if (input && input.value.trim()) {
            this.analytics.track('comment_post', {
                user_id: this.currentUser.id,
                content_length: input.value.length
            });
            
            input.value = '';
            this.showNotification('Comment posted!');
        }
    }

    sharePost() {
        this.showModal('Share Post', `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
                <button onclick="app.shareToFacebook()" style="display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px solid var(--border-medium); border-radius: 8px; background: none; cursor: pointer;">
                    <div style="width: 24px; height: 24px; background: #1877f2; border-radius: 50%;"></div>
                    Facebook
                </button>
                <button onclick="app.shareToTwitter()" style="display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px solid var(--border-medium); border-radius: 8px; background: none; cursor: pointer;">
                    <div style="width: 24px; height: 24px; background: #1da1f2; border-radius: 50%;"></div>
                    Twitter
                </button>
                <button onclick="app.shareToWhatsApp()" style="display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px solid var(--border-medium); border-radius: 8px; background: none; cursor: pointer;">
                    <div style="width: 24px; height: 24px; background: #25d366; border-radius: 50%;"></div>
                    WhatsApp
                </button>
                <button onclick="app.copyLink()" style="display: flex; align-items: center; gap: 8px; padding: 12px; border: 1px solid var(--border-medium); border-radius: 8px; background: none; cursor: pointer;">
                    <div style="width: 24px; height: 24px; background: var(--text-secondary); border-radius: 50%;"></div>
                    Copy Link
                </button>
            </div>
        `);
    }

    shareVideo(videoId) {
        this.sharePost(); // Same interface
        this.analytics.track('video_share', { video_id: videoId });
    }

    followUser(button) {
        const isFollowing = button.textContent === 'Following';
        button.textContent = isFollowing ? 'Follow' : 'Following';
        button.style.color = isFollowing ? 'var(--accent)' : 'var(--text-secondary)';

        this.analytics.track('user_follow', {
            followed: !isFollowing,
            user_id: this.currentUser.id
        });
    }

    viewStory(username) {
        this.showModal(`${username}'s Story`, `
            <div style="aspect-ratio: 9/16; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; margin-bottom: 16px;">
                📖
            </div>
            <p>Story viewer coming soon! Stories will include:</p>
            <ul style="text-align: left; margin: 12px 0;">
                <li>Photo and video stories</li>
                <li>Real-time reactions</li>
                <li>Story replies</li>
                <li>24-hour expiration</li>
                <li>Story highlights</li>
            </ul>
        `);

        this.analytics.track('story_view', {
            story_user: username,
            viewer_id: this.currentUser.id
        });
    }

    showLiveStreams() {
        this.showModal('Live Streams', `
            <div>
                <h3 style="color: var(--danger); margin-bottom: 16px;">🔴 Live Now</h3>
                
                <div style="border: 1px solid var(--border-light); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <div style="width: 12px; height: 12px; background: var(--danger); border-radius: 50%; animation: pulse 1.5s infinite;"></div>
                        <strong>Wednesday Bible Study</strong>
                        <span style="font-size: 12px; color: var(--text-secondary);">47 watching</span>
                    </div>
                    <p style="color: var(--text-secondary); margin: 0; font-size: 14px;">Join our midweek study of Romans chapter 8</p>
                    <button onclick="app.joinLiveStream()" style="margin-top: 8px; background: var(--danger); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px;">Join Stream</button>
                </div>
                
                <h4 style="margin: 16px 0 8px 0; color: var(--text-secondary);">Upcoming Streams</h4>
                <div style="border: 1px solid var(--border-light); border-radius: 8px; padding: 12px;">
                    <strong>Sunday Morning Service</strong><br>
                    <span style="font-size: 12px; color: var(--text-secondary);">Tomorrow at 9:30 AM EST</span>
                    <button style="float: right; background: none; color: var(--accent); border: 1px solid var(--accent); padding: 4px 8px; border-radius: 4px; font-size: 11px;">Set Reminder</button>
                </div>
            </div>
        `);
    }

    showCreatorDirectory() {
        this.showModal('Creator Directory', `
            <div>
                <h3 style="margin-bottom: 16px;">⭐ Featured Creators</h3>
                
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px; margin-bottom: 12px;">
                    <img src="https://via.placeholder.com/48x48/6366f1/ffffff?text=P" alt="" style="width: 48px; height: 48px; border-radius: 50%;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0; font-size: 14px;">Pastor Rod Baker</h4>
                        <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">2.8K followers • Senior Pastor</p>
                    </div>
                    <button onclick="app.followUser(this)" style="background: var(--accent); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px;">Follow</button>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px; margin-bottom: 12px;">
                    <img src="https://via.placeholder.com/48x48/10b981/ffffff?text=S" alt="" style="width: 48px; height: 48px; border-radius: 50%;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0; font-size: 14px;">Sara Baker</h4>
                        <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">1.2K followers • Youth Ministry</p>
                    </div>
                    <button onclick="app.followUser(this)" style="background: var(--accent); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px;">Follow</button>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px;">
                    <img src="https://via.placeholder.com/48x48/f59e0b/ffffff?text=F" alt="" style="width: 48px; height: 48px; border-radius: 50%;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0; font-size: 14px;">Faith & Finance</h4>
                        <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">987 followers • Financial Teaching</p>
                    </div>
                    <button onclick="app.followUser(this)" style="background: var(--accent); color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px;">Follow</button>
                </div>
            </div>
        `);
    }

    // Modal System
    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal').style.display = 'flex';
        
        // Add animation
        const modal = document.querySelector('.modal-content');
        modal.style.transform = 'scale(0.8)';
        modal.style.opacity = '0';
        
        requestAnimationFrame(() => {
            modal.style.transition = 'all 0.2s ease-out';
            modal.style.transform = 'scale(1)';
            modal.style.opacity = '1';
        });
    }

    closeModal() {
        const modal = document.getElementById('modal');
        const modalContent = document.querySelector('.modal-content');
        
        modalContent.style.transition = 'all 0.15s ease-in';
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 150);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Placeholder methods for share functions
    shareToFacebook() { this.showNotification('Opening Facebook share...'); this.closeModal(); }
    shareToTwitter() { this.showNotification('Opening Twitter share...'); this.closeModal(); }
    shareToWhatsApp() { this.showNotification('Opening WhatsApp share...'); this.closeModal(); }
    copyLink() { this.showNotification('Link copied to clipboard!'); this.closeModal(); }
    joinLiveStream() { this.showNotification('Joining live stream...'); this.closeModal(); }
    savePost() { this.showNotification('Post saved!'); }
    showPostOptions() { this.showNotification('Post options coming soon!'); }
    viewAllComments() { this.showComments(); }
    toggleProfileMenu() { this.showNotification('Profile menu coming soon!'); }
}

// Analytics System
class AmenityAnalytics {
    constructor() {
        this.endpoint = 'https://api.amenityapp.com/analytics';
        this.events = [];
        this.sessionId = this.generateSessionId();
    }

    generateSessionId() {
        return 'amenity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    track(eventType, data) {
        const event = {
            session_id: this.sessionId,
            event_type: eventType,
            timestamp: Date.now(),
            data: {
                ...data,
                user_agent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                platform: this.detectPlatform()
            }
        };

        this.events.push(event);
        console.log('📊 Analytics:', event);

        // Batch send events
        if (this.events.length >= 10) {
            this.flush();
        }
    }

    detectPlatform() {
        const ua = navigator.userAgent;
        if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
        if (/Android/.test(ua)) return 'android';
        if (/Mac/.test(ua)) return 'mac';
        if (/Windows/.test(ua)) return 'windows';
        return 'other';
    }

    flush() {
        if (this.events.length === 0) return;
        
        // In production, send to analytics server
        console.log(`📈 Sending ${this.events.length} analytics events to server`);
        this.events = [];
    }
}

// Global Functions (for onclick handlers)
window.switchFeed = (feedType) => app.switchFeed(feedType);
window.toggleLike = (button) => app.toggleLike(button);
window.toggleVideoLike = (button) => app.toggleVideoLike(button);
window.showComments = () => app.showComments();
window.showVideoComments = (id) => app.showVideoComments(id);
window.sharePost = () => app.sharePost();
window.shareVideo = (id) => app.shareVideo(id);
window.savePost = () => app.savePost();
window.followUser = (button) => app.followUser(button);
window.viewStory = (username) => app.viewStory(username);
window.playVideo = (id) => app.playVideo(id);
window.showPostOptions = () => app.showPostOptions();
window.viewAllComments = () => app.viewAllComments();
window.toggleProfileMenu = () => app.toggleProfileMenu();
window.closeModal = () => app.closeModal();

// Initialize App
const app = new AmenityApp();

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFloat {
        0% { transform: scale(1) translateY(0); opacity: 1; }
        100% { transform: scale(1.5) translateY(-30px); opacity: 0; }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);