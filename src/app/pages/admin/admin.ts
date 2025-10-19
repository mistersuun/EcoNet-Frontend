import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService, ContactSubmission, BookingRequest } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  // Data
  contactSubmissions: ContactSubmission[] = [];
  bookingRequests: BookingRequest[] = [];
  urgentContacts: ContactSubmission[] = [];

  // UI State
  loading = true;
  activeTab: 'contacts' | 'bookings' | 'urgent' = 'bookings';
  isConfigured = false;

  // Stats
  stats = {
    totalContacts: 0,
    totalBookings: 0,
    urgentContacts: 0,
    pendingBookings: 0
  };

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.isConfigured = this.supabaseService.isConfigured();

    if (this.isConfigured) {
      await this.loadData();
    }

    this.loading = false;
  }

  async loadData() {
    try {
      // Load all data in parallel
      const [contacts, bookings, urgent] = await Promise.all([
        this.supabaseService.getRecentContacts(100),
        this.supabaseService.getRecentBookings(100),
        this.supabaseService.getUrgentContacts()
      ]);

      this.contactSubmissions = contacts;
      this.bookingRequests = bookings;
      this.urgentContacts = urgent;

      // Calculate stats
      this.stats.totalContacts = contacts.length;
      this.stats.totalBookings = bookings.length;
      this.stats.urgentContacts = urgent.length;
      this.stats.pendingBookings = bookings.filter(b => b.status === 'pending').length;
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }

  async updateContactStatus(id: string, status: string) {
    const result = await this.supabaseService.updateContactStatus(id, status);
    if (result.success) {
      await this.loadData();
    }
  }

  async updateBookingStatus(id: string, status: string) {
    const result = await this.supabaseService.updateBookingStatus(id, status);
    if (result.success) {
      await this.loadData();
    }
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'contacted': return 'badge-contacted';
      case 'confirmed': return 'badge-confirmed';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      case 'resolved': return 'badge-resolved';
      default: return 'badge-default';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount?: number): string {
    if (!amount) return '0.00$';
    return `${amount.toFixed(2)}$`;
  }

  getUserEmail(): string {
    const user = this.authService.getCurrentUser();
    return user?.email || 'Admin';
  }

  async logout() {
    await this.authService.signOut();
  }
}
