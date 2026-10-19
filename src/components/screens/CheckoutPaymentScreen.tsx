import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  ChevronRight,
  Receipt,
  QrCode,
  Download,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { ScreenId } from '../../types/screens';

interface CheckoutPaymentScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
  totalAmount?: number;
}

export const CheckoutPaymentScreen: React.FC<CheckoutPaymentScreenProps> = ({
  onNavigate,
  playClickSound,
  totalAmount = 220,
}) => {
  const [method, setMethod] = useState<'fpx' | 'duitnow' | 'card'>('fpx');
  const [selectedBank, setSelectedBank] = useState('Maybank2u');
  const [donorName, setDonorName] = useState('Ahmad Zulkifli bin Hashim');
  const [donorIC, setDonorIC] = useState('880415-14-5321');
  const [donorEmail, setDonorEmail] = useState('ahmad.zulkifli@gmail.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('state') === 'receipt'
  );
  const [receiptSerial] = useState(() => `MRM-2026-TX-${849210}`);

  const banks = [
    { name: 'Maybank2u', code: 'MBB', popular: true },
    { name: 'CIMB Clicks', code: 'CIMB', popular: true },
    { name: 'Bank Islam', code: 'BIMB', popular: true },
    { name: 'RHB Now', code: 'RHB', popular: false },
    { name: 'Public Bank', code: 'PBB', popular: false },
    { name: 'Hong Leong Connect', code: 'HLB', popular: false },
  ];

  const handlePay = () => {
    playClickSound?.();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="relative min-h-full flex flex-col justify-between p-4 u-canvas pb-8 select-none">
      {isSuccess ? (
        /* Official Tax-Deductible Donation Receipt */
        <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>

          <div className="text-center space-y-1">
            <span className="u-badge u-badge-brand text-[10px]">
              ALHAMDULILLAH • INFAQ DISBURSED
            </span>
            <h2 className="text-lg font-extrabold mt-1">
              Sadaqah Successfully Transferred
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              May Allah reward your sincerity and multiply your provision.
            </p>
          </div>

          {/* Official Malaysian Tax Exemption Receipt Card */}
          <div className="w-full p-4 u-card space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 text-[11px]">
              <div>
                <strong className="font-bold block">
                  MULTIRACIAL REVERTED MUSLIMS (MRM)
                </strong>
                <span className="text-slate-500 text-[10px]">
                  PPM-022-14-11072014 • LHDN 01/35/42/51/179
                </span>
              </div>
              <span className="u-badge u-badge-brand text-[9px]">TAX DEDUCTIBLE</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Receipt Serial:</span>
                <span className="font-bold">{receiptSerial}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Donor Name:</span>
                <span className="font-semibold">{donorName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>NRIC / Passport:</span>
                <span className="font-semibold">{donorIC}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Channel:</span>
                <span className="text-emerald-600 font-bold">
                  {method === 'fpx'
                    ? `FPX Online (${selectedBank})`
                    : method === 'duitnow'
                    ? 'DuitNow QR Instant'
                    : 'Visa / Mastercard'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/70 flex justify-between text-sm font-bold">
                <span>Total Disbursed:</span>
                <span className="text-emerald-600">RM {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl u-subtle flex items-center justify-between text-[10px] text-slate-500">
              <span>PDF Copy sent to {donorEmail}</span>
              <Receipt className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="w-full flex gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                onNavigate('home');
              }}
              className="flex-1 py-3 rounded-xl u-btn-primary font-bold text-xs cursor-pointer text-center"
            >
              Back to MRM Hub
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                onNavigate('dashboard');
              }}
              className="py-3 px-4 rounded-xl u-btn-secondary font-semibold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Impact Ledger</span>
            </button>
          </div>
        </div>
      ) : (
        /* Contribution Payment Form */
        <div className="space-y-4">
          {/* Summary Box */}
          <div className="p-4 u-card flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-mono font-bold block">
                TOTAL INFAQ ALLOCATION
              </span>
              <div className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5">
                RM {totalAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <span className="u-badge u-badge-brand text-[10px]">
                LHDN TAX RELIEF APPLIED
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                256-Bit Bank Encrypted
              </span>
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wide">
              Select Islamic Payment Gateway:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fpx', label: 'FPX Banking', sub: 'Maybank, CIMB, BIMB' },
                { id: 'duitnow', label: 'DuitNow QR', sub: 'TNG, MAE, Boost' },
                { id: 'card', label: 'Debit / Card', sub: 'Visa & Mastercard' },
              ].map((opt) => {
                const isSelected = method === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playClickSound?.();
                      setMethod(opt.id as any);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'u-btn-primary shadow-xs'
                        : 'u-card hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div
                      className={`text-[9px] mt-0.5 ${
                        isSelected ? 'text-emerald-50' : 'text-slate-500'
                      }`}
                    >
                      {opt.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FPX Bank Selector */}
          {method === 'fpx' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">
                Choose Malaysian Commercial Bank:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {banks.map((bank) => {
                  const isBankSelected = selectedBank === bank.name;
                  return (
                    <button
                      key={bank.name}
                      type="button"
                      onClick={() => {
                        playClickSound?.();
                        setSelectedBank(bank.name);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isBankSelected
                          ? 'u-btn-primary shadow-xs'
                          : 'u-card hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-bold truncate">{bank.name}</span>
                      </div>
                      {bank.popular && (
                        <span
                          className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                            isBankSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-500/10 text-emerald-600'
                          }`}
                        >
                          FAST
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {method === 'duitnow' && (
            <div className="p-4 u-card text-center space-y-2">
              <div className="w-32 h-32 mx-auto p-2 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>
              <div className="text-xs font-bold">
                Scan with Touch 'n Go, MAE or Islamic Bank App
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                DuitNow ID: 01354251179 (MRM Charity)
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="p-3.5 u-card space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold">Islamic Debit / Credit Card</span>
                <span className="u-badge u-badge-brand text-[9px]">3D Secure 2.0</span>
              </div>
              <input
                type="text"
                defaultValue="4532 •••• •••• 8841"
                className="w-full px-3 py-2 rounded-xl u-subtle border border-slate-200/80 font-mono text-xs"
              />
            </div>
          )}

          {/* Donor Information for LHDN Tax Exemption */}
          <div className="p-3.5 u-card space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>LHDN Tax Exemption Receipt Details</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">
                SEC. 44(6) ITA 1967
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                  Full Name (as in NRIC / Passport):
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl u-subtle border border-slate-200/80 text-xs font-medium focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    NRIC Number:
                  </label>
                  <input
                    type="text"
                    value={donorIC}
                    onChange={(e) => setDonorIC(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl u-subtle border border-slate-200/80 text-xs font-mono focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                    Receipt Email:
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl u-subtle border border-slate-200/80 text-xs focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Niat Du'a Reminder */}
          <div className="p-3 rounded-xl u-subtle border border-slate-200/70 text-center text-[11px] italic">
            "Nawaitu an ukhrija sadaqah / infaq hadzihi lillahi ta'ala."
            <span className="block text-[10px] text-slate-500 not-italic mt-0.5">
              (I intend to give this Sadaqah for the pleasure of Allah Almighty)
            </span>
          </div>

          {/* Bottom Confirmation Button */}
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full min-h-[46px] py-3.5 rounded-xl u-btn-primary font-bold text-xs shadow-sm active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Connecting to {selectedBank} Secure Gateway...</span>
            ) : (
              <>
                <HeartHandshake className="w-4 h-4" />
                <span>Confirm & Disburse RM {totalAmount.toFixed(2)}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
