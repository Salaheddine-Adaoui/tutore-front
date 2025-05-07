import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Aucune redirection, laisser passer toute requête
  return NextResponse.next();
}

// Appliquer à toutes les pages, aucune restriction
export const config = {
  matcher: ['/', '/Recommandation', '/historique', '/formualire'], // Applique cette logique à toutes les pages que tu veux, mais ici c'est pour toutes.
};
