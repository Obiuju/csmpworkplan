const API_BASE = '/.netlify/functions';

export const api = {
  // Get all workplans/activities
  async getWorkplans() {
    const response = await fetch(`${API_BASE}/get-workplans`);
    if (!response.ok) throw new Error('Failed to fetch workplans');
    return response.json();
  },

  // Create a new workplan/activity
  async createWorkplan(workplanData: any) {
    const response = await fetch(`${API_BASE}/create-workplan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workplanData)
    });
    if (!response.ok) throw new Error('Failed to create workplan');
    return response.json();
  },

  // Update a workplan/activity
  async updateWorkplan(id: string, updateData: any) {
    const response = await fetch(`${API_BASE}/update-workplan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updateData })
    });
    if (!response.ok) throw new Error('Failed to update workplan');
    return response.json();
  },

  // Delete a workplan/activity
  async deleteWorkplan(id: string) {
    const response = await fetch(`${API_BASE}/delete-workplan`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to delete workplan');
    return response.json();
  }
};
