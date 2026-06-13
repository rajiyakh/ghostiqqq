export interface Submission {
  id: string;
  x_username: string;
  wallet_address: string;
  comment_link: string;
  referral_code: string;
  referred_by: string | null;
  submission_date: string;
  status: 'pending' | 'verified' | 'rejected';
}

export type Page = 'home' | 'quest' | 'admin';

export type QuestStep = 'tasks' | 'comment' | 'username' | 'wallet' | 'success';

export interface TaskStatus {
  id: number;
  title: string;
  description: string;
  actionLabel: string;
  actionUrl?: string;
  completed: boolean;
  opened: boolean;
}
