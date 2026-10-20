import React, { useState, useEffect, useRef } from 'react';
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
  Trash2,
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
  playClickSound?: (freq?: number) => void;
}

const DEFAULT_MESSAGES: Message[] = [
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
];

export const ChatMessagingScreen: React.FC<ChatMessagingScreenProps> = ({
  playClickSound,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('mrm_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MESSAGES;
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackSec, setAudioPlaybackSec] = useState(0);
  const audioTimerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('mrm_chat_messages', JSON.stringify(messages));
    } catch {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Audio simulation with Web Audio
  const playAudioVoiceNote = () => {
    if (isPlayingAudio) {
      clearInterval(audioTimerRef.current);
      setIsPlayingAudio(false);
      setAudioPlaybackSec(0);
      return;
    }

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {}

    setIsPlayingAudio(true);
    setAudioPlaybackSec(0);
    audioTimerRef.current = setInterval(() => {
      setAudioPlaybackSec((prev) => {
        if (prev >= 24) {
          clearInterval(audioTimerRef.current);
          setIsPlayingAudio(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, []);

  const getSmartReply = (userText: string): string => {
    const lower = userText.toLowerCase();
    if (lower.includes('food') || lower.includes('box') || lower.includes('aid') || lower.includes('hamper')) {
      return 'Alhamdulillah. The pantry dispatch log has recorded this. Please take a quick photo of the beneficiary handover if permitted.';
    }
    if (lower.includes('zakat') || lower.includes('fitrah') || lower.includes('fidyah')) {
      return 'Barakallahu feekum. Our Shariah welfare audit desk will review the asnaf qualification and issue the official LHDN tax voucher.';
    }
    if (lower.includes('mentor') || lower.includes('revert') || lower.includes('halaqa') || lower.includes('class')) {
      return 'MashaAllah. We have paired you with our senior mentor squad at Masjid Wilayah. Would 3:00 PM Saturday suit for the intake session?';
    }
    if (lower.includes('salam') || lower.includes('assalam')) {
      return 'Wa alaikumussalam wa rahmatullah. How can the MRM Care pastoral desk assist you today brother/sister?';
    }
    if (lower.includes('arrived') || lower.includes('here') || lower.includes('location')) {
      return 'Noted on your arrival. Kindly check in with Brother Faisal at the reception desk to receive your field kit.';
    }
    return 'Jazakallahu khair for the prompt update! The MRM welfare ledger has been updated and your coordinator is on standby.';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    playClickSound?.(750);

    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userText = inputMessage.trim();

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: userText,
      time: currentTimeStr,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Contextual auto-reply from caseworker
    setTimeout(() => {
      playClickSound?.(880);
      const replyText = getSmartReply(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-reply-${Date.now()}`,
          sender: 'coordinator',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1100);
  };

  const handleClearChat = () => {
    playClickSound?.(400);
    if (confirm('Clear chat history and reset to welcome messages?')) {
      setMessages(DEFAULT_MESSAGES);
      localStorage.removeItem('mrm_chat_messages');
    }
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

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClearChat}
            title="Reset conversation"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => playClickSound?.()}
            className="px-3 py-1.5 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call</span>
          </button>
        </div>
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
                      onClick={playAudioVoiceNote}
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
                        Voice Note • {isPlayingAudio ? `0:${audioPlaybackSec.toString().padStart(2, '0')}` : msg.audioDuration}
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
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          'Aid delivery completed safely.',
          'Requesting 1-on-1 revert mentor call.',
          'Arrived at Masjid Wilayah Hub.',
          'Zakat eligibility consultation query.',
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
          onClick={() => {
            playClickSound?.();
            setInputMessage('Attached: Field handover receipt confirmation.');
          }}
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
