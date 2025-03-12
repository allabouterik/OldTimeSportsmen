import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { request, cookies } = context;
  const url = new URL(request.url);

  // block access to the production site (unless the user has a valid cookie)
  if (url.href.includes('oldtimesportsmen.com')) {
    const accessCookie = cookies.get('prod_access');
    if (!accessCookie || accessCookie.value !== 'true') {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  return next();
});
