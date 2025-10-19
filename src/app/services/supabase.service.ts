import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface ContactSubmission {
  id?: string;
  created_at?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  service_type?: string;
  property_size?: string;
  preferred_date?: string;
  message: string;
  urgent_request: boolean;
  language?: string;
  user_agent?: string;
  ip_address?: string;
  status?: string;
  notes?: string;
  assigned_to?: string;
  contacted_at?: string;
  resolved_at?: string;
}

export interface BookingRequest {
  id?: string;
  created_at?: string;
  service_type: string;
  service_name: string;
  service_price: number;
  property_type?: string;
  property_size?: number;
  bedrooms?: number;
  bathrooms?: number;
  address?: string;
  city?: string;
  postal_code?: string;
  preferred_date: string;
  preferred_time: string;
  frequency: string;
  additional_services?: any;
  special_instructions?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  contact_method?: string;
  subtotal: number;
  taxes: number;
  total: number;
  language?: string;
  user_agent?: string;
  ip_address?: string;
  status?: string;
  notes?: string;
  assigned_to?: string;
  confirmed_at?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Only initialize Supabase in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSupabase();
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
        console.warn(
          'Supabase credentials not configured. Database storage disabled. ' +
          'Please update environment files with your Supabase credentials. ' +
          'See SUPABASE_SETUP.md for instructions.'
        );
        return;
      }

      this.supabase = createClient(
        environment.supabase.url,
        environment.supabase.anonKey
      );
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
    }
  }

  /**
   * Check if Supabase is configured and ready
   */
  isConfigured(): boolean {
    return this.supabase !== null;
  }

  /**
   * Save contact form submission to database
   */
  async saveContactSubmission(
    data: ContactSubmission
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    if (!this.supabase) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      // Add metadata
      const submissionData = {
        ...data,
        language: data.language || 'fr',
        user_agent: navigator.userAgent,
        status: 'pending'
      };

      const { data: result, error } = await this.supabase
        .from('contact_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        console.error('Error saving contact submission:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Exception saving contact submission:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Save booking request to database
   */
  async saveBookingRequest(
    data: BookingRequest
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    if (!this.supabase) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      // Add metadata
      const bookingData = {
        ...data,
        language: data.language || 'fr',
        user_agent: navigator.userAgent,
        status: 'pending'
      };

      const { data: result, error } = await this.supabase
        .from('booking_requests')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Error saving booking request:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      console.error('Exception saving booking request:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Get recent contact submissions (for admin panel)
   */
  async getRecentContacts(limit: number = 50): Promise<ContactSubmission[]> {
    if (!this.supabase) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching contacts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching contacts:', error);
      return [];
    }
  }

  /**
   * Get recent booking requests (for admin panel)
   */
  async getRecentBookings(limit: number = 50): Promise<BookingRequest[]> {
    if (!this.supabase) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching bookings:', error);
      return [];
    }
  }

  /**
   * Get urgent contact requests (for admin panel)
   */
  async getUrgentContacts(): Promise<ContactSubmission[]> {
    if (!this.supabase) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('contact_submissions')
        .select('*')
        .eq('urgent_request', true)
        .neq('status', 'resolved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching urgent contacts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching urgent contacts:', error);
      return [];
    }
  }

  /**
   * Update contact submission status (for admin panel)
   */
  async updateContactStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      const updateData: any = { status };
      if (notes) {
        updateData.notes = notes;
      }
      if (status === 'contacted') {
        updateData.contacted_at = new Date().toISOString();
      }
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await this.supabase
        .from('contact_submissions')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating contact status:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Exception updating contact status:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Update booking request status (for admin panel)
   */
  async updateBookingStatus(
    id: string,
    status: string,
    notes?: string,
    scheduledDate?: string,
    scheduledTime?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      const updateData: any = { status };
      if (notes) {
        updateData.notes = notes;
      }
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
        if (scheduledDate) updateData.scheduled_date = scheduledDate;
        if (scheduledTime) updateData.scheduled_time = scheduledTime;
      }
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
      if (status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }

      const { error } = await this.supabase
        .from('booking_requests')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating booking status:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Exception updating booking status:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }
}
