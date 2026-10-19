import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  HeartHandshake,
  Download,
  Clock,
  CheckCircle2,
  BarChart3,
  Calculator,
} from 'lucide-react';
import { ScreenId, CatalogItem } from '../../types/screens';
import { UserRole } from '../../types';
import { ROLE_CONFIGS, RoleConfig } from '../../types/roleConfig';
import { calculateZakatObligation } from '../../utils/mrmLogic';

interface DashboardScreenProps {
  currentRole?: UserRole;
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: (freq?: number) => void;
  onAddToCart?: (item: CatalogItem) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentRole = 'staff_admin',
  onNavigate,
  playClickSound,
  onAddToCart,
}) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [reportExported, setReportExported] = useState(false);

  // Interactive Zakat Calculator state
  const [monthlyIncome, setMonthlyIncome] = useState<number>(6500);
  const [annualSavings, setAnnualSavings] = useState<number>(18000);
  const [zakatPledged, setZakatPledged] = useState(false);

  const roleMeta: RoleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.staff_admin;
  const zakatAssessment = calculateZakatObligation(monthlyIncome, annualSavings, 24000);

  const periodData = {
    week: {
      units: '18 Squads',
      sla: '12.8 mins',
      zakatPool: 'RM 42,800',
      beneficiaries: '94 Families',
      bars: [
        { label: 'Mon', val: 42 },
        { label: 'Tue', val: 68 },
        { label: 'Wed', val: 85 },
        { label: 'Thu', val: 56 },
        { label: 'Fri', val: 94 },
        { label: 'Sat', val: 112 },
        { label: 'Sun', val: 78 },
      ],
    },
    month: {
      units: '24 Squads',
      sla: '14.2 mins',
      zakatPool: 'RM 184,500',
      beneficiaries: '320 Families',
      bars: [
        { label: 'Wk 1', val: 210 },
        { label: 'Wk 2', val: 265 },
        { label: 'Wk 3', val: 310 },
        { label: 'Wk 4', val: 348 },
        { label: 'Proj', val: 380 },
      ],
    },
    year: {
      units: '42 Squads',
      sla: '13.6 mins',
      zakatPool: 'RM 2.14M',
      beneficiaries: '3,840 Families',
      bars: [
        { label: 'Q1', val: 820 },
        { label: 'Q2', val: 960 },
        { label: 'Q3', val: 1140 },
        { label: 'Q4', val: 1320 },
      ],
    },
  }[period];

  const maxVal = Math.max(...periodData.bars.map((d) => d.val));

  const handleExport = () => {
    playClickSound?.(800);
    setReportExported(true);
    setTimeout(() => setReportExported(false), 2400);
  };

  const handlePledgeZakat = () => {
    playClickSound?.(880);
    if (zakatAssessment.monthlyZakat > 0) {
      onAddToCart?.({
        id: `zakat-${Date.now()}`,
        title: 'Direct Monthly Zakat Al-Mal Contribution',
        category: 'Zakat Aid',
        description: 'Monthly 2.5% Zakat Al-Mal assessment for verified Asnaf & Muallaf distribution',
        price: zakatAssessment.monthlyZakat,
        imageUrl: '',
        coordinator: 'MRM Zakat Board (Certified)',
        location: 'Wilayah Persekutuan & Selangor',
        rating: 5.0,
        reviewsCount: 412,
        badge: 'LHDN Tax Deductible',
      });
      setZakatPledged(true);
      setTimeout(() => {
        setZakatPledged(false);
        onNavigate('cart');
      }, 900);
    }
  };

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-8 select-none space-y-4">
      {/* Sub-header Bar with Period Switcher & Audit Export */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex p-1 rounded-xl u-subtle border border-slate-200/80">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                playClickSound?.(760);
                setPeriod(p);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                period === p
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="min-h-[36px] py-1.5 px-3 rounded-xl u-btn-secondary text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>{reportExported ? 'Audit Exported ✓' : 'Export Audit CSV'}</span>
        </button>
      </div>

      {/* Dynamic KPI Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 u-card">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Audited Zakat & Infaq
          </span>
          <div className="text-lg font-bold font-mono text-emerald-600 mt-1">
            {periodData.zakatPool}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            100% LHDN Sec 44(6) verified
          </span>
        </div>

        <div className="p-3.5 u-card">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Asnaf & Reverts Aided
          </span>
          <div className="text-lg font-bold font-mono mt-1">
            {periodData.beneficiaries}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
            +18% vs previous {period}
          </span>
        </div>

        <div className="p-3.5 u-card">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Active Field Units
          </span>
          <div className="text-lg font-bold font-mono mt-1">{periodData.units}</div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            Role: {roleMeta.shortLabel}
          </span>
        </div>

        <div className="p-3.5 u-card">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Median Dispatch SLA
          </span>
          <div className="text-lg font-bold font-mono text-emerald-600 mt-1">
            {periodData.sla}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            Target &lt; 15.0 mins
          </span>
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="p-4 u-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Field Relief & Mentorship Hours ({period.toUpperCase()})</span>
            </h2>
            <span className="text-[11px] text-slate-500">
              Verified volunteer & caseworker hours logged
            </span>
          </div>
          <span className="u-badge u-badge-brand text-[10px]">Live Ledger</span>
        </div>

        <div className="h-36 flex items-end justify-between gap-2 pt-4 px-1 border-b border-slate-200/70 pb-2">
          {periodData.bars.map((item) => {
            const pct = Math.max(15, Math.round((item.val / maxVal) * 100));
            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center justify-end h-full gap-1.5"
              >
                <span className="text-[10px] font-mono font-bold text-emerald-600">
                  {item.val}h
                </span>
                <div className="w-full max-w-[34px] bg-emerald-500/15 rounded-t-lg overflow-hidden flex items-end h-24">
                  <div
                    className="w-full bg-emerald-600 rounded-t-lg transition-all duration-300"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Zakat Nisab Calculator (2.5% Assessment) */}
      <div className="p-4 u-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Zakat Income & Savings Calculator (2.5%)</span>
            </h2>
            <span className="text-[11px] text-slate-500">
              2026 Wilayah Persekutuan Nisab Threshold: RM 24,000 / year
            </span>
          </div>
          <span
            className={`u-badge text-[10px] ${
              zakatAssessment.isAboveNisab ? 'u-badge-brand' : 'u-badge-gray'
            }`}
          >
            {zakatAssessment.isAboveNisab ? 'Zakat Eligible' : 'Below Nisab'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
              Gross Monthly Income (RM)
            </label>
            <input
              type="number"
              min={0}
              step={250}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-xl u-subtle border border-slate-200/80 text-xs font-mono font-bold focus:outline-hidden focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
              Annual Savings / Haul (RM)
            </label>
            <input
              type="number"
              min={0}
              step={500}
              value={annualSavings}
              onChange={(e) => setAnnualSavings(Math.max(0, Number(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-xl u-subtle border border-slate-200/80 text-xs font-mono font-bold focus:outline-hidden focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl u-subtle border border-slate-200/70 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-slate-500">
            <span>Assessable Annual Wealth (after 40% Had Kifayah):</span>
            <span className="font-bold">
              RM {zakatAssessment.eligibleAnnualWealth.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Annual Zakat Obligation (2.5%):</span>
            <span className="font-bold text-emerald-600">
              RM {zakatAssessment.annualZakat.toLocaleString()} / yr
            </span>
          </div>
          <div className="pt-1.5 border-t border-slate-200/70 flex justify-between text-xs font-bold">
            <span>Recommended Monthly Zakat:</span>
            <span className="text-emerald-600">
              RM {zakatAssessment.monthlyZakat.toLocaleString()} / mo
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePledgeZakat}
          disabled={!zakatAssessment.isAboveNisab}
          className="w-full min-h-[42px] py-2.5 px-4 rounded-xl u-btn-primary text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>
            {zakatPledged
              ? 'Added to Infaq Basket ✓'
              : zakatAssessment.isAboveNisab
              ? `Pledge Monthly Zakat (RM ${zakatAssessment.monthlyZakat})`
              : 'Wealth Below Nisab (Optional Sadaqah Only)'}
          </span>
        </button>
      </div>
    </div>
  );
};
