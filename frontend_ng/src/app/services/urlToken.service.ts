import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface RecoveryTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  expiresIn: number;
  tokenType: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class UrlTokenService {
  constructor(private router: Router) {}

  /**
   * Extracts recovery tokens from URL fragment
   * Returns null if no valid recovery tokens found
   */
  extractRecoveryTokens(): RecoveryTokens | null {
    const fragment = window.location.hash.substring(1); // Remove the '#'

    if (!fragment) {
      return null;
    }

    const params = new URLSearchParams(fragment);

    // Check if this is a recovery type
    if (params.get('type') !== 'recovery') {
      return null;
    }

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresAt = params.get('expires_at');
    const expiresIn = params.get('expires_in');
    const tokenType = params.get('token_type');
    const type = params.get('type');

    // Validate required tokens are present
    if (!accessToken || !refreshToken || !expiresAt || !type) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAt, 10),
      expiresIn: parseInt(expiresIn || '0', 10),
      tokenType: tokenType || 'bearer',
      type,
    };
  }

  /**
   * Cleans up the URL by removing the fragment
   */
  cleanupUrl(): void {
    // Replace current URL without the fragment
    const cleanUrl = window.location.pathname + window.location.search;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  /**
   * Stores recovery tokens in session storage
   */
  storeRecoveryTokens(tokens: RecoveryTokens): void {
    localStorage.setItem('recoveryTokens', JSON.stringify(tokens));
  }

  /**
   * Retrieves recovery tokens from session storage
   */
  getStoredRecoveryTokens(): RecoveryTokens | null {
    const stored = localStorage.getItem('recoveryTokens');
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch {
      // Invalid JSON, remove it
      localStorage.removeItem('recoveryTokens');
      return null;
    }
  }

  /**
   * Clears recovery tokens from session storage
   */
  clearRecoveryTokens(): void {
    localStorage.removeItem('recoveryTokens');
  }

  /**
   * Checks if stored tokens are still valid (not expired)
   */
  areTokensValid(): boolean {
    const tokens = this.getStoredRecoveryTokens();
    if (!tokens) {
      return false;
    }

    // Check if token has expired (with 30 second buffer)
    const now = Math.floor(Date.now() / 1000);
    return tokens.expiresAt > now + 30;
  }
}
