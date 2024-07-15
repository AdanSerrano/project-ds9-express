import { NextRequest } from 'next/server';
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, privateRoutes } from './routes';

export async function middleware(req: any) {
    const { nextUrl } = req;


    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)


    if (isApiAuthRoute) {
        return undefined;
    }

    if (isAuthRoute) {
        const redirectUrl = new URL(DEFAULT_LOGIN_REDIRECT, nextUrl);
        return Response.redirect(redirectUrl);
    }

    if (isPrivateRoute) {
        const redirectUrl = new URL("/auth/login", nextUrl);
        return Response.redirect(redirectUrl)
    }

    return undefined;

}
