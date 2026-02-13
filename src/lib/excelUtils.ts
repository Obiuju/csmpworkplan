import * as XLSX from 'xlsx';
import type { Activity } from '@/lib/types';
import { PILLARS, OBJECTIVES, STATUSES, PRIORITIES, NIGERIAN_STATES, STATUS_PERCENTAGES } from '@/lib/constants';

// Export template with dropdowns
export function exportTemplate() {
  const wb = XLSX.utils.book_new();
  
  // Create data sheet with headers
  const headers = [
    'Level', 'State Name', 'Pillar', 'Objective', 'Activity Title', 'KPI',
    'Status', 'Priority', 'Due Date', 'Responsible Organization', 'Next Action', 'MOV'
  ];
  
  const sampleRow = [
    'Federal', '', 'Pillar 1: Regulatory Oversight and Governance',
    'Obj 1.1: Establish MMACC & NCSM-TWG with harmonised legislative framework for cosmetics safety in Nigeria',
    'Sample Activity Title', 'Sample KPI', 'Not Started', 'Medium', '2024-12-31',
    'Sample Organization', 'Next action item', 'Mode of verification'
  ];
  
  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 10 }, { wch: 15 }, { wch: 50 }, { wch: 80 }, { wch: 40 },
    { wch: 30 }, { wch: 25 }, { wch: 10 }, { wch: 12 }, { wch: 25 },
    { wch: 30 }, { wch: 30 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Activities');
  
  // Create reference sheet with valid values
  const refData = [
    ['Level Options', 'State Names', 'Pillar Options', 'Status Options', 'Priority Options'],
    ['Federal', NIGERIAN_STATES[0], Object.values(PILLARS)[0], STATUSES[0], PRIORITIES[0]],
    ['State', NIGERIAN_STATES[1], Object.values(PILLARS)[1], STATUSES[1], PRIORITIES[1]],
    ['', NIGERIAN_STATES[2], Object.values(PILLARS)[2], STATUSES[2], PRIORITIES[2]],
  ];
  
  // Add more states
  for (let i = 3; i < NIGERIAN_STATES.length; i++) {
    if (refData[i + 1]) {
      refData[i + 1][1] = NIGERIAN_STATES[i];
    } else {
      refData.push(['', NIGERIAN_STATES[i], '', STATUSES[i] || '', '']);
    }
  }
  
  const refWs = XLSX.utils.aoa_to_sheet(refData);
  refWs['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 50 }, { wch: 25 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, refWs, 'Reference Values');
  
  // Create objectives reference
  const objData: string[][] = [['Pillar', 'Objective Short', 'Objective Full']];
  Object.entries(OBJECTIVES).forEach(([key, objectives]) => {
    objectives.forEach(obj => {
      objData.push([PILLARS[key as keyof typeof PILLARS], obj.short, obj.full]);
    });
  });
  
  const objWs = XLSX.utils.aoa_to_sheet(objData);
  objWs['!cols'] = [{ wch: 50 }, { wch: 15 }, { wch: 100 }];
  XLSX.utils.book_append_sheet(wb, objWs, 'Objectives Reference');
  
  XLSX.writeFile(wb, 'NPCSH_Activity_Template.xlsx');
}

// Export current activities
export function exportActivities(activities: Activity[]) {
  if (activities.length === 0) {
    alert('No activities to export');
    return;
  }

  const headers = [
    'Level', 'State Name', 'Pillar', 'Objective', 'Activity Title', 'KPI',
    'Status', 'Status %', 'Priority', 'Due Date', 'Responsible Org',
    'Next Action', 'MOV', 'Created By', 'Created At'
  ];

  const data = activities.map(a => [
    a.level === 'federal' ? 'Federal' : 'State',
    a.stateName || '',
    a.pillar,
    a.objective,
    a.title,
    a.description || '',
    a.status,
    STATUS_PERCENTAGES[a.status] + '%',
    a.priority,
    a.dueDate || '',
    a.assignee || '',
    a.nextAction || '',
    a.mov || '',
    a.createdBy,
    new Date(a.createdAt).toLocaleString()
  ]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  
  ws['!cols'] = [
    { wch: 10 }, { wch: 15 }, { wch: 50 }, { wch: 80 }, { wch: 40 },
    { wch: 30 }, { wch: 25 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    { wch: 25 }, { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 20 }
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Activities');
  XLSX.writeFile(wb, `NPCSH_Activities_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Import activities from Excel
// Convert Excel serial date number to date string
function excelDateToString(value: any): string {
  if (!value) return '';
  // If it's already a string that looks like a date, return it
  if (typeof value === 'string') return value;
  // If it's a number, treat it as Excel serial date
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }
  }
  return String(value);
}

export function parseImportFile(file: File): Promise<Partial<Activity>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array', cellDates: false });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
        
        const activities: Partial<Activity>[] = jsonData.map(row => {
          const level: 'federal' | 'state' = (row['Level'] || '').toLowerCase().includes('state') ? 'state' : 'federal';
          const status = STATUSES.find(s => s === row['Status']) || 'Not Started';
          const priority = PRIORITIES.find(p => p === row['Priority']) || 'Medium';
          
          // Find objective short name
          let objectiveShort = row['Objective'] || '';
          Object.values(OBJECTIVES).forEach(objs => {
            const found = objs.find(o => o.full === row['Objective']);
            if (found) objectiveShort = found.short;
          });
          
          return {
            level,
            stateName: level === 'state' ? row['State Name'] : undefined,
            pillar: row['Pillar'] || Object.values(PILLARS)[0],
            objective: row['Objective'] || '',
            objectiveShort,
            title: row['Activity Title'] || '',
            description: row['KPI'] || '',
            status,
            priority,
            dueDate: excelDateToString(row['Due Date']),
            assignee: row['Responsible Organization'] || row['Responsible Org'] || '',
            nextAction: row['Next Action'] || '',
            mov: row['MOV'] || ''
          };
        }).filter(a => a.title); // Filter out rows without titles
        
        resolve(activities);
      } catch (error) {
        reject(new Error('Failed to parse file. Please ensure it\'s a valid Excel file.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
