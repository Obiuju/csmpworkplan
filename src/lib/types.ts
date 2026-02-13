import { STATUSES, PRIORITIES } from './constants';

export type StatusType = typeof STATUSES[number];
export type PriorityType = typeof PRIORITIES[number];

export interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

export interface Activity {
  id: number;
  level: 'federal' | 'state';
  stateName?: string;
  pillar: string;
  objective: string;
  objectiveShort: string;
  title: string;
  description: string;
  status: StatusType;
  priority: PriorityType;
  dueDate: string;
  assignee: string;
  nextAction: string;
  mov: string;
  createdBy: string;
  createdAt: string;
  lastUpdated?: string;
  comments: Comment[];
}

export type StatusFilter = StatusType | 'All';
