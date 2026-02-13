import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PILLARS, OBJECTIVES, STATUSES, PRIORITIES, NIGERIAN_STATES } from '@/lib/constants';
import type { Activity } from '@/lib/types';

interface EditActivityModalProps {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: number, updates: Partial<Activity>) => void;
}

export function EditActivityModal({ activity, open, onClose, onSave }: EditActivityModalProps) {
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

  useEffect(() => {
    if (activity) {
      setLevel(activity.level);
      setStateName(activity.stateName || '');
      const pk = Object.keys(PILLARS).find(k => PILLARS[k as keyof typeof PILLARS] === activity.pillar) || 'pillar1';
      setPillar(pk);
      setObjective(activity.objective);
      setObjectiveManual(activity.objective);
      setTitle(activity.title);
      setDescription(activity.description || '');
      setStatus(activity.status);
      setPriority(activity.priority);
      setDueDate(activity.dueDate || '');
      setAssignee(activity.assignee || '');
      setNextAction(activity.nextAction || '');
      setMov(activity.mov || '');
    }
  }, [activity]);

  const objectives = OBJECTIVES[pillar] || [];

  const handleSubmit = () => {
    if (!activity) return;
    
    const finalObjective = level === 'federal' ? objective : objectiveManual;
    if (!finalObjective || !title) {
      alert('Please fill in required fields');
      return;
    }

    const objData = objectives.find(o => o.full === objective);
    
    onSave(activity.id, {
      level,
      stateName: level === 'state' ? stateName : undefined,
      pillar: PILLARS[pillar as keyof typeof PILLARS],
      objective: finalObjective,
      objectiveShort: level === 'federal' && objData ? objData.short : finalObjective,
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
      nextAction,
      mov
    });
    onClose();
  };

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Activity</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label>Level</Label>
            <Select value={level} onValueChange={(v: 'federal' | 'state') => setLevel(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="federal">Federal</SelectItem>
                <SelectItem value="state">State</SelectItem>
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
            <Label>Pillar</Label>
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
              <Label>Objective</Label>
              <Select value={objective} onValueChange={setObjective}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Objective</Label>
              <Input
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="Enter objective"
              />
            </div>
          )}

          <div>
            <Label>Activity Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div>
            <Label>KPI</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div>
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>

          <div>
            <Label>Responsible Organization</Label>
            <Input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Responsible Org" />
          </div>

          <div>
            <Label>Next Action</Label>
            <Input value={nextAction} onChange={e => setNextAction(e.target.value)} />
          </div>

          <div>
            <Label>MOV</Label>
            <Textarea value={mov} onChange={e => setMov(e.target.value)} rows={2} />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="flex-1">Save</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
