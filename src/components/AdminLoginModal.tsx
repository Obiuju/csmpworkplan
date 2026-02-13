import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ADMIN_PASSCODE } from '@/lib/constants';

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ open, onClose, onSuccess }: AdminLoginModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setPasscode('');
      setError('');
      onSuccess();
    } else {
      setError('Invalid passcode. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Admin Access Required</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <p className="text-muted-foreground text-sm">
            Please enter the admin passcode to access this section.
          </p>
          
          <div>
            <Input
              type="password"
              value={passcode}
              onChange={e => {
                setPasscode(e.target.value);
                setError('');
              }}
              placeholder="Enter passcode"
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Login
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
