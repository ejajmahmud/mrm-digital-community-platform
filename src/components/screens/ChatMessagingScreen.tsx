import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  Phone,
  Play,
  Pause,
  CheckCheck,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';
import { ASSETS } from '../../data/assets';

interface Message {
  id: string;
  sender: 'me' | 'coordinator';
  text?: string;
  isAudio?: boolean;
  audioDuration?: string;
  time: string;
}

interface ChatMessagingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
}

export const ChatMessagingScreen: React.FC<ChatMessagingScreenProps> = ({
  playClickSound,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'coordinator',
      text: 'Assalamu alaikum. Welcome to MRM Care Services. I am Ustaz Ridzwan, your assigned caseworker.',
      time: '14:20',
    },
    {
      id: 'm-2',
      sender: 'coordinator',
      isAudio: true,
      audioDuration: '0:24',
      time: '14:22',
    },
    {
      id: 'm-3',
      sender: 'me',
      text: 'Wa alaikumussalam Ustaz. Brother Hisham is already en route with the emergency food box. ETA 15 mins.',
      time: '14:25',
    },
    {
      id: 'm-4',
      sender: 'coordinator',
      text: 'Alhamdulillah, excellent coordination. Please let me know once delivery confirmation is signed.',
      time: '14:28',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    playClickSound?.();

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-reply-${Date.now()}`,
          sender: 'coordinator',
          text: 'Jazakallahu khair for the prompt update! The MRM welfare ledger has been updated.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 900);
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between p-0 u-canvas select-none">
      {/* Coordinator Status Sub-bar */}
      <div className="px-4 py-2.5 u-surface border-b flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={ASSETS.avatars.volunteer}
              alt="Ustaz Ridzwan"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold">Ustaz Ridzwan</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">
              MRM Pastoral Lead • Online
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => playClickSound?.()}
          className="px-3 py-1.5 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Call</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <div className="text-center my-1">
          <span className="u-badge u-badge-brand text-[10px]">
            <Lock className="w-3 h-3" /> End-to-End Encrypted Revert Care Channel
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'u-btn-primary rounded-br-xs'
                    : 'u-card rounded-bl-xs'
                }`}
              >
                {msg.isAudio ? (
                  <div className="flex items-center gap-3 pr-2">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound?.();
                        setIsPlayingAudio(!isPlayingAudio);
                      }}
                      className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center cursor-pointer shrink-0"
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-0.5 h-3">
                        {[40, 70, 90, 45, 80, 100, 60, 40, 85, 95, 30, 65, 80, 50].map(
                          (h, i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full transition-all ${
                                isPlayingAudio
                                  ? 'bg-emerald-500 animate-pulse'
                                  : 'bg-slate-400'
                              }`}
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Voice Note • {msg.audioDuration}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span>{msg.text}</span>
                )}

                <div
                  className={`flex items-center justify-end gap-1 text-[9px] mt-1 font-mono ${
                    isMe ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reply Chips */}
      <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          'Aid delivery completed safely.',
          'Requesting 1-on-1 revert mentor call.',
          'Arrived at Masjid Wilayah Hub.',
        ].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              playClickSound?.();
              setInputMessage(chip);
            }}
            className="px-2.5 py-1 rounded-lg u-subtle border border-slate-200/80 text-[10px] font-semibold whitespace-nowrap cursor-pointer hover:border-emerald-500/40"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        className="sticky bottom-0 inset-x-0 p-3 u-surface border-t flex items-center gap-2 z-20"
      >
        <button
          type="button"
          onClick={() => playClickSound?.()}
          className="w-9 h-9 rounded-xl u-btn-secondary flex items-center justify-center cursor-pointer shrink-0"
          aria-label="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message caseworker Ustaz Ridzwan..."
          className="flex-1 py-2 px-3 rounded-xl u-subtle border border-slate-200/80 text-xs focus:outline-hidden focus:border-emerald-600"
        />

        {inputMessage.trim() ? (
          <button
            type="submit"
            className="w-9 h-9 rounded-xl u-btn-primary flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              setInputMessage('Aid delivery completed safely.');
            }}
            className="w-9 h-9 rounded-xl u-btn-secondary flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
