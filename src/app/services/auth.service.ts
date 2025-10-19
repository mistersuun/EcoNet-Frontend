import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient | null = null;
  private platformId = inject(PLATFORM_ID);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Only initialize Supabase in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSupabase();
      this.checkSession();
    }
  }

  private initializeSupabase(): void {
    try {
      // Check if credentials are configured
      if (
        !environment.supabase.url ||
        !environment.supabase.anonKey ||
        environment.supabase.url === 'YOUR_SUPABASE_URL' ||
        environment.supabase.anonKey === 'YOUR_SUPABASE_ANON_KEY'
      ) {
        console.warn('Supabase credentials not configured. Auth disabled.');
        return;
      }

      this.supabase = createClient(
        environment.supabase.url,
        environment.supabase.anonKey
      );

      // Listen for auth state changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          this.currentUserSubject.next(session.user);
        } else {
          this.currentUserSubject.next(null);
        }
      });
    } catch (error) {
      console.error('Failed to initialize Supabase Auth:', error);
    }
  }

  /**
   * Check if there's an active session on initialization
   */
  private async checkSession(): Promise<void> {
    if (!this.supabase) return;

    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user) {
        this.currentUserSubject.next(session.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return {
        success: false,
        error: 'Authentication not configured'
      };
    }

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        this.currentUserSubject.next(data.user);
        return { success: true };
      }

      return {
        success: false,
        error: 'Unknown error occurred'
      };
    } catch (error: any) {
      console.error('Exception during sign in:', error);
      return {
        success: false,
        error: error.message || 'Failed to sign in'
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    if (!this.supabase) return;

    try {
      await this.supabase.auth.signOut();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  /**
   * Get the current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    if (!this.supabase) return null;

    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Check if Supabase Auth is configured
   */
  isConfigured(): boolean {
    return this.supabase !== null;
  }
}
