import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Activity, Comment } from '@/lib/types';
import { LinkifyText } from './LinkifyText';

interface CommentsModalProps {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
  onAddComment: (activityId: number, text: string, author: string) => void;
  currentUser: string;
}

export function CommentsModal({ activity, open, onClose, onAddComment, currentUser }: CommentsModalProps) {
  const [newComment, setNewComment] = useState('');

  const handleAdd = () => {
    if (!activity || !newComment.trim()) {
      alert('Enter a comment');
      return;
    }
    onAddComment(activity.id, newComment.trim(), currentUser);
    setNewComment('');
  };

  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comments - {activity.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {activity.comments && activity.comments.length > 0 ? (
            activity.comments.map((c: Comment) => (
              <div key={c.id} className="bg-muted rounded p-3 border">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm">{c.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">
                  <LinkifyText text={c.text} />
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No comments yet</p>
          )}
        </div>
        
        <div className="border-t pt-4">
          <Textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            placeholder="Add comment..."
            className="mb-3"
          />
          <div className="flex gap-3">
            <Button onClick={handleAdd} className="flex-1">Add Comment</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
