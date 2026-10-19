import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  HeartHandshake,
  CreditCard,
  ArrowRight,
  Heart,
  Receipt,
} from 'lucide-react';
import { ScreenId, CartItem } from '../../types/screens';
import { calculateInfaqSummary } from '../../utils/mrmLogic';

interface CartScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
  cartItems?: CartItem[];
  onUpdateCart?: (items: CartItem[]) => void;
  fuelTopUp?: number;
  onUpdateFuelTopUp?: (amount: number) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onNavigate,
  playClickSound,
  cartItems: initialItems,
  onUpdateCart,
  fuelTopUp: externalFuelTopUp,
  onUpdateFuelTopUp,
}) => {
  const [items, setItems] = useState<CartItem[]>(
    initialItems || [
      {
        id: 'infaq-1',
        title: 'Emergency Asnaf Halal Grocery & Staples Box',
        subtitle: 'Nutritional sustenance for 1 needy family (4 pax)',
        price: 120,
        quantity: 1,
        category: 'Food Relief',
        iconName: 'Package',
      },
      {
        id: 'infaq-2',
        title: 'New Revert (Muallaf) Starter Kit & Mentorship',
        subtitle: 'Noble Quran, prayer rug, solat manual & 6mo mentor',
        price: 85,
        quantity: 1,
        category: 'Revert Care',
        iconName: 'Book',
      },
    ]
  );

  const [internalFuelTopUp, setInternalFuelTopUp] = useState<number>(15);
  const fuelTopUp = externalFuelTopUp ?? internalFuelTopUp;

  const [infaqNiat, setInfaqNiat] = useState<'general' | 'parents' | 'zakat'>('general');
  const [dedicatedName, setDedicatedName] = useState('');

  const updateQuantity = (id: string, delta: number) => {
    playClickSound?.();
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      onUpdateCart?.(updated);
      return updated;
    });
  };

  const removeItem = (id: string) => {
    playClickSound?.();
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      onUpdateCart?.(updated);
      return updated;
    });
  };

  const handleFuelChange = (amt: number) => {
    playClickSound?.();
    setInternalFuelTopUp(amt);
    onUpdateFuelTopUp?.(amt);
  };

  const summary = calculateInfaqSummary(items, fuelTopUp);

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-28 select-none space-y-3.5">
      {/* LHDN Tax Deductible Official Notice */}
      <div className="p-3.5 u-card flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <Receipt className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-500 leading-snug">
            <strong className="text-slate-900 font-bold block mb-0.5">
              Official LHDN Tax Exemption (Sec 44(6)):
            </strong>
            Contributions to Multiracial Reverted Muslims (MRM) are 100% tax-deductible.
            Est. Impact: <strong>{summary.estimatedBeneficiaries} Beneficiaries</strong>.
          </div>
        </div>
        <span className="u-badge u-badge-brand text-[10px] shrink-0">
          {summary.totalShares} Shares
        </span>
      </div>

      {/* Allocated Items List */}
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className="p-8 text-center u-card">
            <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold mb-1">No Infaq Pledges Selected</h3>
            <p className="text-xs text-slate-500 mb-4">
              Browse our verified campaigns to sponsor food hampers or revert starter kits.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="py-2.5 px-4 rounded-xl u-btn-primary text-xs font-bold cursor-pointer"
            >
              Browse Welfare Campaigns
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 u-card flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <span className="u-badge u-badge-brand text-[9px] mb-1">
                  {item.category}
                </span>
                <h3 className="text-xs font-bold leading-snug truncate">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {item.subtitle}
                </p>
                <div className="text-xs font-mono font-bold text-emerald-600 mt-1.5">
                  RM {(item.price * item.quantity).toLocaleString()}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    (RM {item.price} × {item.quantity})
                  </span>
                </div>
              </div>

              {/* Quantity & Remove */}
              <div className="flex flex-col items-end justify-between self-stretch shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove sponsorship"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 p-1 rounded-xl u-subtle border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded-lg u-surface flex items-center justify-center cursor-pointer active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold font-mono">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-lg u-surface flex items-center justify-center cursor-pointer active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Infaq Niat & Dedication Section */}
      <div className="p-3.5 u-card space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-emerald-600" />
            <span>Niat & Dedication of Contribution</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">LILLAHI TA'ALA</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'general', label: 'General Sadaqah' },
            { id: 'parents', label: 'Parents / Waqf' },
            { id: 'zakat', label: 'Zakat Asnaf' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                playClickSound?.();
                setInfaqNiat(opt.id as any);
              }}
              className={`py-2 px-2 rounded-xl text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                infaqNiat === opt.id
                  ? 'u-btn-primary shadow-xs'
                  : 'u-subtle border-slate-200/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {infaqNiat === 'parents' && (
          <input
            type="text"
            value={dedicatedName}
            onChange={(e) => setDedicatedName(e.target.value)}
            placeholder="Name of parent or family (e.g. Almarhum Ahmad)..."
            className="w-full px-3 py-2 rounded-xl u-subtle border border-slate-200/80 text-xs focus:outline-hidden focus:border-emerald-600"
          />
        )}
      </div>

      {/* Volunteer Skuad Transit Fuel Top-up */}
      <div className="p-3.5 u-card flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-xs font-bold block">
            Volunteer Fleet Transit & Fuel Support
          </span>
          <span className="text-[11px] text-slate-500 block">
            Helps dispatch vans deliver boxes to Asnaf doorsteps
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {[0, 15, 30].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleFuelChange(amt)}
              className={`py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                fuelTopUp === amt
                  ? 'u-btn-primary shadow-xs'
                  : 'u-subtle border-slate-200/80'
              }`}
            >
              {amt === 0 ? 'None' : `+RM ${amt}`}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown Summary */}
      <div className="p-3.5 u-card space-y-1.5 text-xs font-mono">
        <div className="flex justify-between text-slate-500">
          <span>Relief Provisions Subtotal</span>
          <span className="font-bold">RM {summary.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Volunteer Transit Fund</span>
          <span className="font-bold">RM {summary.logisticsSupport}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>LHDN Official Tax Relief ({summary.receiptReference})</span>
          <span className="text-emerald-600 font-bold">100% Deductible</span>
        </div>
        <div className="pt-2 border-t border-slate-200/70 flex justify-between text-sm font-bold">
          <span>Total Infaq Contribution</span>
          <span className="text-emerald-600">RM {summary.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 inset-x-0 -mx-4 -mb-4 mt-2 p-3.5 u-surface border-t flex items-center justify-between z-20 shadow-lg">
        <div>
          <span className="block text-[10px] text-slate-500 font-mono font-semibold">
            TOTAL TO DISBURSE
          </span>
          <div className="text-base font-extrabold text-emerald-600 font-mono">
            RM {summary.total.toLocaleString()}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound?.();
            onNavigate('checkout');
          }}
          disabled={items.length === 0}
          className="min-h-[42px] py-2.5 px-5 rounded-xl u-btn-primary font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-4 h-4" />
          <span>Proceed to Direct Infaq</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
