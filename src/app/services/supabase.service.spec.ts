import { TestBed } from '@angular/core/testing';

import { EstimateRequest, SupabaseService } from './supabase.service';

describe('SupabaseService.saveEstimateRequest', () => {
  const base: EstimateRequest = {
    email: 'client@example.test',
    add_ons: ['windows'],
    total: 261,
    language: 'fr',
    consent: false,
  };

  it('never sends a request without consent', async () => {
    const service = TestBed.inject(SupabaseService);
    const insert = jasmine.createSpy('insert').and.resolveTo({ error: null });
    (service as any).supabase = { from: () => ({ insert }) };

    const result = await service.saveEstimateRequest({ ...base, consent: false });

    expect(result.success).toBeFalse();
    expect(insert).not.toHaveBeenCalled();
  });

  it('inserts into estimate_requests when consent is given', async () => {
    const service = TestBed.inject(SupabaseService);
    const insert = jasmine.createSpy('insert').and.resolveTo({ error: null });
    const from = jasmine.createSpy('from').and.returnValue({ insert });
    (service as any).supabase = { from };

    const result = await service.saveEstimateRequest({ ...base, consent: true });

    expect(result.success).toBeTrue();
    expect(from).toHaveBeenCalledWith('estimate_requests');
    expect(insert.calls.mostRecent().args[0][0].consent).toBeTrue();
  });

  it('reports a database error', async () => {
    const service = TestBed.inject(SupabaseService);
    (service as any).supabase = { from: () => ({ insert: () => Promise.resolve({ error: { message: 'boom' } }) }) };
    spyOn(console, 'error');

    const result = await service.saveEstimateRequest({ ...base, consent: true });

    expect(result).toEqual({ success: false, error: 'boom' });
  });
});
