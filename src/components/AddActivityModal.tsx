import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PILLARS, OBJECTIVES, STATUSES, PRIORITIES, NIGERIAN_STATES } from '@/lib/constants';
import type { Activity } from '@/lib/types';

interface AddActivityModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (activity: Omit<Activity, 'id' | 'createdAt' | 'comments'>) => void;
  createdBy: string;
}

export function AddActivityModal({ open, onClose, onAdd, createdBy }: AddActivityModalProps) {
  const [level, setLevel] = useState<'federal' | 'state'>('federal');
  const [stateName, setStateName] = useState('');
  const [pillar, setPillar] = useState('pillar1');
  const [objective, setObjective] = useState('');
  const [objectiveManual, setObjectiveManual] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<typeof STATUSES[number]>('Not Started');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [mov, setMov] = useState('');

  const objectives = OBJECTIVES[pillar] || [];

  const handleSubmit = () => {
    if (!objective || !title) {
      alert('Please fill in required fields');
      return;
    }

    const objData = objectives.find(o => o.full === objective);
    
    onAdd({
      level,
      stateName: level === 'state' ? stateName : undefined,
      pillar: PILLARS[pillar as keyof typeof PILLARS],
      objective,
      objectiveShort: objData ? objData.short : objective,
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
      nextAction,
      mov,
      createdBy
    });

    // Reset form
    setLevel('federal');
    setStateName('');
    setPillar('pillar1');
    setObjective('');
    setObjectiveManual('');
    setTitle('');
    setDescription('');
    setStatus('Not Started');
    setPriority('Medium');
    setDueDate('');
    setAssignee('');
    setNextAction('');
    setMov('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Activity</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label>Level *</Label>
            <Select value={level} onValueChange={(v: 'federal' | 'state') => setLevel(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="federal">Federal Level</SelectItem>
                <SelectItem value="state">State Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {level === 'state' && (
            <div>
              <Label>Select State *</Label>
              <Select value={stateName} onValueChange={setStateName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Pillar *</Label>
            <Select value={pillar} onValueChange={setPillar}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PILLARS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {level === 'federal' ? (
            <div>
              <Label>Objective *</Label>
              <Select value={objective} onValueChange={setObjective}>
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map(o => (
                    <SelectItem key={o.short} value={o.full}>{o.full}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label>Objective *</Label>
              <Input
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="Enter objective"
              />
            </div>
          )}

          <div>
            <Label>Activity Title *</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter activity title"
            />
          </div>

          <div>
            <Label>KPI (Key Performance Indicator)</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter KPI details"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v: typeof STATUSES[number]) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v: typeof PRIORITIES[number]) => setPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Responsible Organization</Label>
            <Input
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <Label>Next Action</Label>
            <Input
              value={nextAction}
              onChange={e => setNextAction(e.target.value)}
              placeholder="What's the next step?"
            />
          </div>

          <div>
            <Label>MOV (Mode of Verification)</Label>
            <Textarea
              value={mov}
              onChange={e => setMov(e.target.value)}
              placeholder="Proof of completion/verification method"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Add Activity
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
