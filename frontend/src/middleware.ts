import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const email = request.cookies.get('email');

  if (!email) {
    // Redirection vers /signin si pas connecté
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  return NextResponse.next(); // autorise l'accès
}

// Appliquer seulement à la page d'accueil ("/")
export const config = {
    matcher: ["/", "/Recommandation", "/historique",'/formualire'],
};
