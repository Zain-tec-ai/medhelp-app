# MedHelp Performance Optimization Guide

## Frontend Performance

### 1. Lazy Loading

```javascript
// Load images only when visible
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

### 2. Code Splitting

```javascript
// Load modules on demand
const loadScanner = async () => {
  const { initScanner } = await import('./scanner.js');
  initScanner();
};
```

### 3. Service Worker Caching

```javascript
// sw.js - Cache strategies
const CACHE_NAME = 'medhelp-v1';
const urlsToCache = [
  '/',
  '/style.css',
  '/app.js',
  '/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 4. CSS Optimization

```css
/* Remove unused styles */
/* Use critical CSS inline in <head> */
/* Defer non-critical CSS */

<head>
  <style>
    /* Critical CSS inline */
  </style>
  <link rel="preload" href="style.css" as="style">
</head>
```

### 5. JavaScript Optimization

```javascript
// Debounce expensive operations
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

// Use const/let instead of var
// Avoid global variables
// Use const for functions (faster lookup)
```

## Backend Performance

### 1. Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_health_topics_type ON health_topics(type);
CREATE INDEX idx_appointments_date ON appointments(preferred_date);

-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM appointments WHERE preferred_date > NOW();
```

### 2. Connection Pooling

```javascript
const pool = mysql.createPool({
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});
```

### 3. Response Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 4. Caching Strategies

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

app.get('/api/health-topics', (req, res) => {
  const cached = cache.get('topics');
  if (cached) return res.json(cached);
  
  // Fetch from DB, cache result
  const data = fetchTopics();
  cache.set('topics', data);
  res.json(data);
});
```

### 5. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

## Mobile Performance

### 1. Network Optimization

```javascript
// Minimize requests
// Bundle related data
// Use compression
// Cache aggressively on mobile
```

### 2. Bundle Size

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Check what's included
wepack-bundle-analyzer dist/stats.json
```

### 3. Touch Optimization

```css
/* Increase touch target size to 44x44px minimum */
button, a.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Reduce motion on slow connections */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. Battery Life

```javascript
// Reduce background activity
// Stop animations on low battery
if (navigator.getBattery) {
  navigator.getBattery().then(battery => {
    if (battery.level < 0.2) {
      // Disable animations, reduce refresh rates
    }
  });
}
```

## Monitoring Performance

### 1. Web Vitals

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log); // Cumulative Layout Shift
getFID(console.log); // First Input Delay
getFCP(console.log); // First Contentful Paint
getLCP(console.log); // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte
```

### 2. Performance API

```javascript
performance.mark('search-start');
// ... search operation
performance.mark('search-end');
performance.measure('search', 'search-start', 'search-end');

const measure = performance.getEntriesByName('search')[0];
console.log(`Search took ${measure.duration}ms`);
```

### 3. Analytics

```javascript
// Track performance metrics
window.sendMetric = (name, value) => {
  // Send to analytics service
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify({ name, value })
  });
};
```

## Performance Checklist

- [ ] Gzip compression enabled
- [ ] Images optimized and lazy-loaded
- [ ] CSS minified and critical CSS inlined
- [ ] JavaScript minified and code-split
- [ ] Service Worker caching configured
- [ ] Database indexes created
- [ ] Connection pooling enabled
- [ ] Rate limiting in place
- [ ] Response caching configured
- [ ] Core Web Vitals optimized
- [ ] Mobile touch targets ≥ 44x44px
- [ ] Bundle size < 200KB (gzipped)
- [ ] API response time < 200ms
- [ ] Page load time < 3s on 4G
- [ ] Lighthouse score > 90

## Tools

- **Lighthouse** - https://developers.google.com/web/tools/lighthouse
- **WebPageTest** - https://www.webpagetest.org
- **GTmetrix** - https://gtmetrix.com
- **Chrome DevTools** - Built into Chrome
- **New Relic** - APM and monitoring
- **Sentry** - Error tracking
