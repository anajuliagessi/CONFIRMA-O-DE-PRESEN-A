export interface Companion {
  id: string;
  name: string;
}

export interface RSVP {
  id: string;
  guestName: string;
  attending: boolean;
  hasCompanions: boolean;
  companions: string[];
  createdAt: string;
  updatedAt: string;
  phone?: string;
  message?: string;
}

export interface RSVPStats {
  totalResponses: number;
  attendingCount: number;
  declinedCount: number;
  totalGuestsAndCompanions: number; // main guests attending + companions
  totalCompanionsCount: number;
}

export type StepState = 
  | 'start' 
  | 'presence_choice' 
  | 'companions_choice' 
  | 'companions_list' 
  | 'review' 
  | 'confirmed_yes' 
  | 'confirmed_no';
