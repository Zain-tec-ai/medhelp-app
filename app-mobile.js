// Mobile-optimized version of app.js
// Includes performance optimizations and mobile-specific features

const healthTopics = [
  // ... same topics as app.js
];

const medicineSalts = [
  // ... same salts as app.js
];

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
});

const lazyLoadImages = () => {
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
};

// Virtual scrolling for long lists
class VirtualScroller {
  constructor(container, items, itemHeight, renderFn) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.renderFn = renderFn;
    this.visibleRange = { start: 0, end: 0 };
    this.scrollY = 0;
    
    this.init();
  }

  init() {
    const containerHeight = this.container.clientHeight;
    this.visibleCount = Math.ceil(containerHeight / this.itemHeight) + 2;
    
    this.container.addEventListener('scroll', () => this.onScroll());
    this.render();
  }

  onScroll() {
    this.scrollY = this.container.scrollTop;
    const start = Math.max(0, Math.floor(this.scrollY / this.itemHeight) - 1);
    const end = Math.min(this.items.length, start + this.visibleCount);
    
    if (start !== this.visibleRange.start || end !== this.visibleRange.end) {
      this.visibleRange = { start, end };
      this.render();
    }
  }

  render() {
    const { start, end } = this.visibleRange;
    const offset = start * this.itemHeight;
    
    const content = this.items
      .slice(start, end)
      .map(item => this.renderFn(item))
      .join('');
    
    this.container.innerHTML = `
      <div style="transform: translateY(${offset}px)">
        ${content}
      </div>
    `;
  }
}

// Mobile touch optimization
const enableTouchOptimization = () => {
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchmove', () => {}, { passive: true });
  
  // Increase tap target size
  const buttons = document.querySelectorAll('button, a.btn');
  buttons.forEach(btn => {
    if (btn.offsetHeight < 44) {
      btn.style.minHeight = '44px';
      btn.style.padding = '12px 16px';
    }
  });
};

// Debounce function for expensive operations
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Throttle function for scroll events
const throttle = (fn, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
};

// Cache API responses
class ResponseCache {
  constructor(maxAge = 300000) { // 5 minutes default
    this.cache = {};
    this.maxAge = maxAge;
  }

  set(key, value) {
    this.cache[key] = {
      value,
      timestamp: Date.now()
    };
  }

  get(key) {
    const item = this.cache[key];
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      delete this.cache[key];
      return null;
    }
    
    return item.value;
  }
}

const apiCache = new ResponseCache();

// Optimized form submission
const submitFormOptimized = async (formData, endpoint) => {
  try {
    const button = document.querySelector(`[data-endpoint="${endpoint}"]`);
    if (button) button.disabled = true;
    
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) throw new Error('Request failed');
    return await response.json();
  } finally {
    const button = document.querySelector(`[data-endpoint="${endpoint}"]`);
    if (button) button.disabled = false;
  }
};

// Performance monitoring
if ('PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
      }
    });
    observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
  } catch (e) {
    console.warn('PerformanceObserver not available');
  }
}

// Initialize mobile optimizations on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    enableTouchOptimization();
  });
} else {
  lazyLoadImages();
  enableTouchOptimization();
}
