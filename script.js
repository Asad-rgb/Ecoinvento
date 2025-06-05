// Animate elements on scroll into view
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.fade-slide-up');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger animation when element is 50px from viewport bottom
  });

  elements.forEach(el => observer.observe(el));
});



document.addEventListener('DOMContentLoaded', function() {
  // Initialize accordion items
  const faqItems = document.querySelectorAll('.faq-item');
  
  // Set up click handlers
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-question i');
    
    question.addEventListener('click', function() {
      // Close all items first
      closeAllItems();
      
      // Open this item if it wasn't active
      if (!item.classList.contains('active')) {
        item.classList.add('active');
        item.setAttribute('aria-expanded', 'true');
        answer.classList.remove('hidden');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
      }
    });
    
    // Keyboard accessibility
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
  
  // Function to close all accordion items
  function closeAllItems() {
    faqItems.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-expanded', 'false');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-question i');
      answer.classList.add('hidden');
      icon.classList.remove('fa-minus');
      icon.classList.add('fa-plus');
    });
  }
  
  // Initialize with the active item open
  const activeItem = document.querySelector('.faq-item.active');
  if (activeItem) {
    const answer = activeItem.querySelector('.faq-answer');
    const icon = activeItem.querySelector('.faq-question i');
    answer.classList.remove('hidden');
    icon.classList.remove('fa-plus');
    icon.classList.add('fa-minus');
  }
});



document.addEventListener('DOMContentLoaded', function() {
  // Initialize carousel only if it exists (mobile view)
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('[data-index]');
  const cardCount = cards.length;
  const cardWidth = 280 + 24; // card width + margin (280 + 2*12)

  let currentIndex = 0;
  let isAutoScrolling = true;
  let autoScrollInterval;

  // Clone first and last cards for seamless circular effect
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cardCount - 1].cloneNode(true);
  firstClone.setAttribute('data-index', 'clone-first');
  lastClone.setAttribute('data-index', 'clone-last');
  carousel.appendChild(firstClone);
  carousel.insertBefore(lastClone, cards[0]);

  // Adjust scroll to first real card on load
  window.addEventListener('load', () => {
    carousel.scrollLeft = cardWidth;
    startAutoScroll();
  });

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      if (!isAutoScrolling) return;
      currentIndex++;
      smoothScrollToIndex(currentIndex);
    }, 3500);
  }

  function smoothScrollToIndex(index) {
    carousel.scrollTo({
      left: cardWidth * (index + 1),
      behavior: 'smooth',
    });
  }

  // Handle scroll end to loop carousel circularly
  let isScrolling;
  carousel.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
      const scrollLeft = carousel.scrollLeft;
      // If at clone last (left edge)
      if (scrollLeft <= 0) {
        carousel.scrollLeft = cardWidth * cardCount;
        currentIndex = cardCount - 1;
      }
      // If at clone first (right edge)
      else if (scrollLeft >= cardWidth * (cardCount + 1)) {
        carousel.scrollLeft = cardWidth;
        currentIndex = 0;
      } else {
        currentIndex = Math.round(scrollLeft / cardWidth) - 1;
      }
    }, 150);
  });

  // Pause auto scroll on user interaction
  carousel.addEventListener('mouseenter', () => {
    isAutoScrolling = false;
  });
  carousel.addEventListener('mouseleave', () => {
    isAutoScrolling = true;
  });
  carousel.addEventListener('touchstart', () => {
    isAutoScrolling = false;
  });
  carousel.addEventListener('touchend', () => {
    isAutoScrolling = true;
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // Video Elements
  const video = document.getElementById('guideVideo');
  const playPauseBtn = document.querySelector('.play-pause');
  const progressBar = document.querySelector('.progress-bar');
  const seekSlider = document.querySelector('.seek-slider');
  const currentTimeDisplay = document.querySelector('.current-time');
  const durationDisplay = document.querySelector('.duration');
  const volumeBtn = document.querySelector('.volume-btn');
  const volumeSlider = document.querySelector('.volume-slider');
  const fullscreenBtn = document.querySelector('.fullscreen-btn');
  const chapterItems = document.querySelectorAll('.chapter-item');
  const transcriptItems = document.querySelectorAll('.transcript-content p');
  const toggleTranscriptBtn = document.querySelector('.toggle-transcript');
  const transcriptContent = document.querySelector('.transcript-content');

  // Toggle Play/Pause
  function togglePlayPause() {
    if (video.paused) {
      video.play();
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      video.pause();
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  // Update Progress Bar
  function updateProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percent}%`;
    seekSlider.value = percent;
    currentTimeDisplay.textContent = formatTime(video.currentTime);
  }

  // Format time (seconds to MM:SS)
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Update volume
  function updateVolume() {
    video.volume = volumeSlider.value / 100;
    if (video.volume > 0) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  }

  // Toggle fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Jump to chapter
  function jumpToChapter() {
    const time = parseFloat(this.getAttribute('data-time'));
    video.currentTime = time;
    if (video.paused) {
      video.play();
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
  }

  // Update active transcript
  function updateActiveTranscript() {
    const currentTime = video.currentTime;
    
    transcriptItems.forEach(item => {
      item.classList.remove('active');
      const itemTime = parseFloat(item.getAttribute('data-time'));
      
      if (currentTime >= itemTime) {
        const nextItem = item.nextElementSibling;
        if (!nextItem || currentTime < parseFloat(nextItem.getAttribute('data-time'))) {
          item.classList.add('active');
          // Auto-scroll to active transcript
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // Toggle transcript visibility
  function toggleTranscript() {
    const isExpanded = toggleTranscriptBtn.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      transcriptContent.style.display = 'none';
      toggleTranscriptBtn.setAttribute('aria-expanded', 'false');
      toggleTranscriptBtn.innerHTML = '<span>Show Transcript</span><i class="fas fa-chevron-down"></i>';
    } else {
      transcriptContent.style.display = 'block';
      toggleTranscriptBtn.setAttribute('aria-expanded', 'true');
      toggleTranscriptBtn.innerHTML = '<span>Hide Transcript</span><i class="fas fa-chevron-up"></i>';
    }
  }

  // Event Listeners
  video.addEventListener('click', togglePlayPause);
  playPauseBtn.addEventListener('click', togglePlayPause);
  
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('timeupdate', updateActiveTranscript);
  
  video.addEventListener('loadedmetadata', function() {
    durationDisplay.textContent = formatTime(video.duration);
  });
  
  seekSlider.addEventListener('input', function() {
    const seekTime = (video.duration / 100) * seekSlider.value;
    video.currentTime = seekTime;
  });
  
  volumeBtn.addEventListener('click', function() {
    if (video.volume > 0) {
      video.volume = 0;
      volumeSlider.value = 0;
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      video.volume = 0.8;
      volumeSlider.value = 80;
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  });
  
  volumeSlider.addEventListener('input', updateVolume);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  
  chapterItems.forEach(item => {
    item.addEventListener('click', jumpToChapter);
  });
  
  transcriptItems.forEach(item => {
    item.addEventListener('click', function() {
      const time = parseFloat(this.getAttribute('data-time'));
      video.currentTime = time;
    });
  });
  
  toggleTranscriptBtn.addEventListener('click', toggleTranscript);
  
  // Initialize volume
  video.volume = 0.8;
  volumeSlider.value = 80;
});

// Handle form submission
document.getElementById('subscribeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input').value;
  
  // Here you would typically send the email to your server
  console.log('Subscribed with email:', email);
  
  // Show success message (you can customize this)
  alert('Thank you for subscribing!');
  this.reset();
});

// Add hover effects to social icons programmatically
document.querySelectorAll('.social-icons a').forEach(icon => {
  icon.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px)';
  });
  
  icon.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});





