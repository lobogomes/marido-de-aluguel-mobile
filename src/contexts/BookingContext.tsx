import React, { createContext, useContext, useState, useCallback } from 'react';
import { Booking, Provider, UrgencyLevel } from '../types';
import { MOCK_PROVIDERS } from '../data/providers';

type NewBookingData = {
  providerId: string;
  service: string;
  urgency: UrgencyLevel;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  description: string;
  estimatedPrice: number;
};

type BookingContextType = {
  bookings: Booking[];
  pendingBooking: Partial<NewBookingData> | null;
  setPendingBooking: (data: Partial<NewBookingData> | null) => void;
  createBooking: (data: NewBookingData) => Promise<Booking>;
  payBooking: (bookingId: string, method: string) => Promise<void>;
  cancelBooking: (bookingId: string) => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    provider: MOCK_PROVIDERS[0],
    clientId: 'u1',
    service: 'Instalação elétrica',
    urgency: 'normal',
    status: 'confirmado',
    scheduledDate: '2024-10-28',
    scheduledTime: '09:00',
    address: 'Rua das Flores, 123 - Pinheiros',
    description: 'Instalar 3 tomadas na sala e trocar interruptores.',
    estimatedPrice: 180,
    paid: true,
    createdAt: '2024-10-21',
  },
  {
    id: 'b2',
    provider: MOCK_PROVIDERS[1],
    clientId: 'u1',
    service: 'Reparo de vazamento',
    urgency: 'urgente',
    status: 'concluido',
    scheduledDate: '2024-10-19',
    scheduledTime: '14:00',
    address: 'Rua das Flores, 123 - Pinheiros',
    description: 'Torneira da cozinha está vazando.',
    estimatedPrice: 150,
    finalPrice: 160,
    paid: true,
    createdAt: '2024-10-19',
  },
];

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [pendingBooking, setPendingBooking] = useState<Partial<NewBookingData> | null>(null);

  const createBooking = useCallback(async (data: NewBookingData): Promise<Booking> => {
    await new Promise(r => setTimeout(r, 800));
    const provider = MOCK_PROVIDERS.find(p => p.id === data.providerId)!;
    const booking: Booking = {
      id: `b${Date.now()}`,
      provider,
      clientId: 'u1',
      ...data,
      status: 'pendente',
      paid: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBookings(prev => [booking, ...prev]);
    return booking;
  }, []);

  const payBooking = useCallback(async (bookingId: string, _method: string) => {
    await new Promise(r => setTimeout(r, 1500));
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, paid: true, status: 'confirmado' } : b
      )
    );
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelado' } : b
      )
    );
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, pendingBooking, setPendingBooking, createBooking, payBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}
