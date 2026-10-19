import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  MapPin, 
  PhoneCall, 
  ShieldAlert, 
  Send 
} from 'lucide-react';
import { Assignment } from '../../../types';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';

interface AssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  onUpdateAssignment: (asg: Assignment) => void;
}

export const AssignmentsModal: React.FC<AssignmentsModalProps> = ({
  isOpen,
  onClose,
  assignments,
  onUpdateAssignment
}) => {
  const [selectedAsgId, setSelectedAsgId] = useState<string>(assignments[0]?.id || '');
  const [newNote, setNewNote] = useState('');
  const [showSafeguardAlert, setShowSafeguardAlert] = useState(false);

  if (!isOpen) return null;

  const currentAsg = assignments.find(a => a.id === selectedAsgId) || assignments[0];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !currentAsg) return;

    const updated: Assignment = {
      ...currentAsg,
      notes: [...currentAsg.notes, `Update (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}): ${newNote}`]
    };
    onUpdateAssignment(updated);
    setNewNote('');
  };

  const handleMarkCompleted = () => {
    if (!currentAsg) return;
    const updated: Assignment = {
      ...currentAsg,
      status: 'completed',
      notes: [...currentAsg.notes, 'Assignment verified as successfully completed by volunteer. Submitted for coordinator recognition.']
    };
    onUpdateAssignment(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-emerald-800">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Community Assignments</h2>
              <p className="text-xs text-slate-500">Coordinated, accountable service delivery</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {assignments.map((asg) => (
              <button
                key={asg.id}
                onClick={() => setSelectedAsgId(asg.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium whitespace-nowrap border transition-all cursor-pointer ${
                  currentAsg?.id === asg.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {asg.title.slice(0, 22)}...
              </button>
            ))}
          </div>

          {currentAsg ? (
            <div className="space-y-3.5">
              <Card className="border-slate-200 shadow-xs">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">
                        {currentAsg.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{currentAsg.title}</h3>
                    </div>
                    <Badge variant={currentAsg.status === 'completed' ? 'default' : 'secondary'}>
                      {currentAsg.status === 'completed' ? 'Completed' : 'Active'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{currentAsg.area}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentAsg.assignedDate}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">Care Recipient: {currentAsg.beneficiaryName}</p>
                    <p className="text-slate-500 italic">Instructions: {currentAsg.instructions}</p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      onClick={() => alert('Starting secure masked call. Beneficiary numbers remain private.')}
                      className="flex-1 text-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-emerald-800" /> Safe Contact
                    </Button>
                    {currentAsg.status !== 'completed' && (
                      <Button
                        onClick={handleMarkCompleted}
                        className="flex-1 text-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Mark Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-700">Progress Log</p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {currentAsg.notes.map((n, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600">
                      {n}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-1.5 pt-1">
                  <Input
                    placeholder="Log a progress note or visit..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="h-10 text-xs"
                  />
                  <Button type="submit" size="sm" className="h-10">
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>

              {/* Safeguarding Alert */}
              <div className="pt-1">
                <Button
                  variant="outline"
                  onClick={() => setShowSafeguardAlert(!showSafeguardAlert)}
                  className="w-full text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
                >
                  <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Report Concern to Safeguarding Lead
                </Button>

                {showSafeguardAlert && (
                  <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-2">
                    <p className="font-semibold">Safeguarding Lead Notification</p>
                    <p className="text-rose-700 leading-normal">
                      Escalating notifies the Designated Safeguarding Lead (DSL) and pauses volunteer direct contact pending staff review.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        alert('Case escalated to MRM Safeguarding Lead.');
                        setShowSafeguardAlert(false);
                      }}
                      className="w-full text-xs"
                    >
                      Confirm Safeguarding Escalation
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No active assignments currently.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
