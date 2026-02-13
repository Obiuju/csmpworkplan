export const PILLARS = {
  'pillar1': 'Pillar 1: Regulatory Oversight and Governance',
  'pillar2': 'Pillar 2: Cosmetics Vigilance and Health Intelligence',
  'pillar3': 'Pillar 3: Unlocking the Cosmetics Value Chain'
} as const;

export const OBJECTIVES: Record<string, { short: string; full: string }[]> = {
  'pillar1': [
    { short: 'Obj 1.1', full: 'Obj 1.1: Establish MMACC & NCSM-TWG with harmonised legislative framework for cosmetics safety in Nigeria' },
    { short: 'Obj 1.2', full: 'Obj 1.2: Develop, harmonise, and periodically update standards, regulations, and codes of practice' },
    { short: 'Obj 1.3', full: 'Obj 1.3: Strengthen pre-market registration and traceability of cosmetic products' },
    { short: 'Obj 1.4', full: 'Obj 1.4: Strengthen enforcement, inspection, and post-market surveillance' },
    { short: 'Obj 1.5', full: 'Obj 1.5: To strengthen institutional capacity for regulation, monitoring, and safety assessment' },
    { short: 'Obj 1.6', full: 'Obj 1.6: Strengthen oversight and governance across all tiers of government' },
    { short: 'Obj 1.7', full: 'Obj 1.7: Integrate cosmeceuticals as a recognised category within the national cosmetics policy' }
  ],
  'pillar2': [
    { short: 'Obj 2.1', full: 'Obj 2.1: Institutionalise a national cosmetovigilance system for adverse event reporting' },
    { short: 'Obj 2.2', full: 'Obj 2.2: Strengthen laboratory testing, surveillance, and emergency response capacity' },
    { short: 'Obj 2.3', full: 'Obj 2.3: Develop a guideline on the traceability of cosmetic products' },
    { short: 'Obj 2.4', full: 'Obj 2.4: Develop a national database on cosmetics' },
    { short: 'Obj 2.5', full: 'Obj 2.5: Periodically review the list for active cosmetics ingredients and the prohibition list to reduce exposure to heavy metals' },
    { short: 'Obj 2.6', full: 'Obj 2.6: Enhance public awareness and stakeholder sensitisation on chemical hazards in cosmetics' }
  ],
  'pillar3': [
    { short: 'Obj 3.1', full: 'Obj 3.1: Promote safe and inclusive local production' },
    { short: 'Obj 3.2', full: 'Obj 3.2: Expand export market access and the competitiveness of Nigerian cosmetics' },
    { short: 'Obj 3.3', full: 'Obj 3.3: Strengthen human capital development for the cosmetics sector' }
  ]
};

export const STATUSES = ['Not Started', 'Initiated', 'In Progress', 'Substantially Completed', 'Completed'] as const;
export type StatusType = typeof STATUSES[number];

export const STATUS_COLORS: Record<StatusType, string> = {
  'Not Started': 'hsl(0, 84%, 60%)',
  'Initiated': 'hsl(25, 95%, 53%)',
  'In Progress': 'hsl(48, 96%, 53%)',
  'Substantially Completed': 'hsl(84, 81%, 44%)',
  'Completed': 'hsl(142, 71%, 45%)'
};

export const STATUS_BG_CLASSES: Record<StatusType, string> = {
  'Not Started': 'bg-red-500',
  'Initiated': 'bg-orange-500',
  'In Progress': 'bg-yellow-500',
  'Substantially Completed': 'bg-lime-500',
  'Completed': 'bg-green-500'
};

export const STATUS_PERCENTAGES: Record<StatusType, number> = {
  'Not Started': 0,
  'Initiated': 25,
  'In Progress': 50,
  'Substantially Completed': 75,
  'Completed': 100
};

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
] as const;

export const PRIORITIES = ['Low', 'Medium', 'High'] as const;

export const ADMIN_PASSCODE = 'FDScsmp2022';
