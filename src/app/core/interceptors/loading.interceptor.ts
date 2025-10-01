import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../../shared/services/loader.service';

/**
 * HTTP Interceptor that automatically shows/hides loader for all HTTP requests
 * Excludes certain URLs that shouldn't trigger the global loader (analytics, polling, etc.)
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // List of URL patterns that should not trigger the loader
  const excludedUrls = [
    '/analytics',
    '/polling',
    '/heartbeat',
    '/health-check'
  ];

  // Check if this request should be excluded from loading
  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  if (!shouldExclude) {
    // Show loader before request starts
    loaderService.showHttpRequest(req.url);
  }

  // Handle the request and ensure loader is hidden when complete
  return next(req).pipe(
    finalize(() => {
      if (!shouldExclude) {
        // Hide loader after request completes (success or error)
        loaderService.hide();
      }
    })
  );
};
