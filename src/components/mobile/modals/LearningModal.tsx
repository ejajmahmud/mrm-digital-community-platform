import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Play, 
  Radio, 
  Clock, 
  Bookmark 
} from 'lucide-react';
import { LearningItem } from '../../../types';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: LearningItem[];
}

export const LearningModal: React.FC<LearningModalProps> = ({ isOpen, onClose, items }) => {
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(items[0] || null);
  const [filter, setFilter] = useState<string>('all');
  const [registeredIds, setRegisteredIds] = useState<string[]>(['lrn-1']);

  if (!isOpen) return null;

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'live') return item.isLive;
    return item.category === filter;
  });

  const toggleRegister = (id: string) => {
    if (registeredIds.includes(id)) {
      setRegisteredIds(registeredIds.filter(i => i !== id));
    } else {
      setRegisteredIds([...registeredIds, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 text-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-emerald-800">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Learning & Events</h2>
              <p className="text-xs text-slate-500">Approved teachers & recordings</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'live', label: 'Live Sessions' },
            { id: 'revert', label: 'Revert Basics' },
            { id: 'quran', label: 'Quran' },
            { id: 'lifestyle', label: 'Halal Living' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filter === f.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {selectedItem && (
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {selectedItem.isLive && (
                      <Badge variant="destructive" className="mb-1 text-[10px]">
                        LIVE TONIGHT · {selectedItem.liveTime}
                      </Badge>
                    )}
                    <h3 className="text-sm font-bold text-slate-900">{selectedItem.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedItem.author} <span className="text-slate-400">({selectedItem.authorRole})</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleRegister(selectedItem.id)}
                    className="h-8 w-8"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${registeredIds.includes(selectedItem.id) ? 'fill-emerald-800 text-emerald-800' : ''}`} />
                  </Button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{selectedItem.content}</p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {selectedItem.duration}
                  </span>
                  <span>{selectedItem.language}</span>
                </div>

                <div className="pt-1">
                  {selectedItem.isLive ? (
                    <Button
                      onClick={() => alert(`Connecting to virtual room for "${selectedItem.title}"`)}
                      className="w-full text-xs"
                    >
                      <Radio className="w-3.5 h-3.5 mr-1.5" /> Join Live Classroom
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => alert(`Playing lecture: "${selectedItem.title}"`)}
                      className="w-full text-xs"
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5" /> Watch Approved Recording
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* List */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500">Approved Curriculum</p>
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`cursor-pointer transition-all ${
                    selectedItem?.id === item.id ? 'border-emerald-700 bg-emerald-50/20' : 'hover:border-slate-300'
                  }`}
                >
                  <CardContent className="p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.author} · {item.duration}</p>
                    </div>
                    {item.isLive && (
                      <Badge variant="destructive" className="text-[10px]">Live</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
