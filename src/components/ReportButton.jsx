import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ReportButton = ({ reportedType, reportedId, reportedName, variant = "ghost", className = "" }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason || !description || description.length < 10) {
      toast.error('Please select a reason and provide a detailed description (min 10 characters)');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        `${BACKEND_URL}/api/reports`,
        {
          reported_type: reportedType,
          reported_id: reportedId,
          reason,
          description
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Report submitted successfully');
      setShowDialog(false);
      setReason('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setShowDialog(true)}
        className={className}
        title="Report"
      >
        🚨 Report
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Report {reportedType}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Reporting: <strong>{reportedName}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Reason</label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-700">
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="fraud">Fraud / Scam</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                  <SelectItem value="fake">Fake Product / Profile</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details about why you're reporting this..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {description.length}/500 characters (min 10)
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-red-500 hover:bg-red-600"
                disabled={submitting || !reason || description.length < 10}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportButton;
