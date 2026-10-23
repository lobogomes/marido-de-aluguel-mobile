export type ServiceCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
};

export type Review = {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
};

export type Provider = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  services: string[];
  serviceCategories: string[];
  location: { lat: number; lng: number };
  address: string;
  city: string;
  distance?: number;
  bio: string;
  priceRange: { min: number; max: number };
  responseTime: string;
  completedJobs: number;
  verified: boolean;
  available: boolean;
  phone: string;
  reviews: Review[];
};

export type UrgencyLevel = 'normal' | 'urgente' | 'emergencia';

export type BookingStatus =
  | 'pendente'
  | 'confirmado'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado';

export type Booking = {
  id: string;
  provider: Provider;
  clientId: string;
  service: string;
  urgency: UrgencyLevel;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  description: string;
  estimatedPrice: number;
  finalPrice?: number;
  createdAt: string;
  paid: boolean;
};

export type UserType = 'cliente' | 'prestador';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  type: UserType;
  address?: string;
  city?: string;
  rating?: number;
  completedJobs?: number;
  services?: string[];
};

export type PaymentMethod = {
  id: string;
  type: 'credito' | 'debito' | 'pix';
  label: string;
  last4?: string;
  icon: string;
};

export type FilterOptions = {
  minRating: number;
  maxDistance: number;
  sortBy: 'avaliacao' | 'distancia' | 'preco';
  urgency?: UrgencyLevel;
};
