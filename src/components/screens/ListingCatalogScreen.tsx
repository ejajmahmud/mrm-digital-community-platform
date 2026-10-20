import React, { useState } from 'react';
import {
  Grid as GridIcon,
  List as ListIcon,
  HeartHandshake,
  Check,
  Users,
  Receipt,
} from 'lucide-react';
import { ScreenId, CatalogItem } from '../../types/screens';
import { ASSETS } from '../../data/assets';
import { calculateCampaignProgress } from '../../utils/mrmLogic';

export interface CampaignDetailData {
  id: string;
  title: string;
  category: string;
  target: number;
  raised: number;
  beneficiaries: string;
  unitCost: number;
  description: string;
  imageUrl: string;
  coordinator: string;
  location: string;
  rating: number;
  reviewsCount: number;
  badge: string;
  deadline: string;
}

export const MRM_CAMPAIGNS: CampaignDetailData[] = [
  {
    id: 'camp-1',
    title: 'Emergency Asnaf Halal Grocery & Staples Box',
    category: 'Food Relief',
    target: 45000,
    raised: 36800,
    beneficiaries: '320 Families in Klang Valley',
    unitCost: 120,
    description:
      'Rice, cooking oil, flour, dates, milk powder, and pantry staples delivered directly to verified Asnaf families.',
    imageUrl: ASSETS.catalog.foodHamper,
    coordinator: 'Ustaz Ridzwan (KL Central Ops)',
    location: 'PPR Lembah Subang & Kerinchi',
    rating: 4.9,
    reviewsCount: 184,
    badge: 'Immediate Dispatch',
    deadline: '8 Days Left',
  },
  {
    id: 'camp-2',
    title: 'New Revert (Muallaf) Starter Pack & Mentorship',
    category: 'Revert Care',
    target: 30000,
    raised: 26400,
    beneficiaries: '210 New Reverts',
    unitCost: 85,
    description:
      'Hardcover Noble Quran, padded prayer rug, pictorial Salah guide, and 6 months 1-on-1 brother/sister mentor matching.',
    imageUrl: ASSETS.catalog.revertKit,
    coordinator: 'Sister Mariam Al-Hadi',
    location: 'Nationwide Courier',
    rating: 5.0,
    reviewsCount: 312,
    badge: 'Verified Revert Kit',
    deadline: 'Ongoing Program',
  },
  {
    id: 'camp-3',
    title: 'Elderly Asnaf Hospital & Dialysis Transit Squad',
    category: 'Healthcare',
    target: 20000,
    raised: 15400,
    beneficiaries: '75 Dialysis Patients',
    unitCost: 50,
    description:
      'Wheelchair-accessible van transit to and from Hospital Kuala Lumpur and Selayang for impoverished elderly patients.',
    imageUrl: ASSETS.catalog.healthcare,
    coordinator: 'Brother Farhan (Fleet Lead)',
    location: 'Kuala Lumpur Metro',
    rating: 4.8,
    reviewsCount: 92,
    badge: 'Medical Transit',
    deadline: '14 Days Left',
  },
  {
    id: 'camp-4',
    title: 'Direct Asnaf Monthly Living Subsidy Share',
    category: 'Zakat Aid',
    target: 80000,
    raised: 69500,
    beneficiaries: '150 Single Mother Families',
    unitCost: 250,
    description:
      'Monthly subsistence assistance directly transferred to audited single mothers and revert families facing eviction.',
    imageUrl: ASSETS.stories.zakat,
    coordinator: 'MRM Zakat Board (Certified)',
    location: 'Selangor & Federal Territory',
    rating: 5.0,
    reviewsCount: 418,
    badge: '100% Zakat Audited',
    deadline: 'Monthly Fund',
  },
  {
    id: 'camp-5',
    title: 'Muallaf Emergency Shelter & Protection Fund',
    category: 'Revert Care',
    target: 50000,
    raised: 34200,
    beneficiaries: '45 Safe Nights Provided',
    unitCost: 150,
    description:
      'Safe interim boarding and legal counseling for new reverts expelled from family homes following their Shahada.',
    imageUrl: ASSETS.banners.revertHalaqa,
    coordinator: 'Capt. Razali Noor (Security Ops)',
    location: 'Confidential Transit Home, PJ',
    rating: 4.9,
    reviewsCount: 64,
    badge: 'Confidential Care',
    deadline: 'Critical Need',
  },
  {
    id: 'camp-6',
    title: 'Street Dawah Outreach & Multi-Language Books',
    category: 'Dawah',
    target: 18000,
    raised: 14700,
    beneficiaries: '5,000 Visitors & Inquirers',
    unitCost: 35,
    description:
      'English, Mandarin, and Tamil Islamic introductory literature and interfaith dialogue booths at tourist centers.',
    imageUrl: ASSETS.feed.volunteerCelebration,
    coordinator: 'Bro Firdaus Wong & Dawah Squad',
    location: 'Bukit Bintang & Batu Caves Hub',
    rating: 4.9,
    reviewsCount: 156,
    badge: 'Street Dawah',
    deadline: 'Weekly Program',
  },
];

interface ListingCatalogScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
  onAddToCart?: (item: CatalogItem) => void;
  cartCount?: number;
  onSelectCampaign?: (campaignId: string) => void;
}

export const ListingCatalogScreen: React.FC<ListingCatalogScreenProps> = ({
  onNavigate,
  playClickSound,
  onAddToCart,
  onSelectCampaign,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sponsoredId, setSponsoredId] = useState<string | null>(null);

  const categories = ['All', 'Revert Care', 'Food Relief', 'Zakat Aid', 'Healthcare', 'Dawah'];

  const filtered =
    activeCategory === 'All'
      ? MRM_CAMPAIGNS
      : MRM_CAMPAIGNS.filter((c) => c.category === activeCategory);

  const handleSponsor = (e: React.MouseEvent, camp: CampaignDetailData) => {
    e.stopPropagation();
    playClickSound?.();
    setSponsoredId(camp.id);
    onAddToCart?.({
      id: camp.id,
      title: camp.title,
      category: camp.category,
      description: camp.description,
      price: camp.unitCost,
      imageUrl: camp.imageUrl,
      isFree: false,
      coordinator: camp.coordinator,
      location: camp.location,
      rating: camp.rating,
      reviewsCount: camp.reviewsCount,
      badge: camp.badge,
      duration: camp.deadline,
    });
    setTimeout(() => setSponsoredId(null), 1600);
  };

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-28 select-none space-y-3.5">
      {/* Official Tax-Exempt Banner + View Toggle */}
      <div className="p-3 u-card flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-[11px] text-slate-500 leading-snug truncate">
            <strong className="font-bold text-slate-900">100% Tax Deductible:</strong>{' '}
            Official LHDN Sec 44(6) receipt issued.
          </p>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg u-subtle border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              setViewMode('list');
            }}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-500'
            }`}
            aria-label="List view"
          >
            <ListIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              setViewMode('grid');
            }}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-500'
            }`}
            aria-label="Grid view"
          >
            <GridIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playClickSound?.();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'u-btn-primary shadow-xs'
                  : 'u-card hover:border-emerald-500/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Campaigns List or Grid */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filtered.map((camp) => {
            const progress = calculateCampaignProgress(camp.raised, camp.target);
            const isAdded = sponsoredId === camp.id;

            return (
              <div
                key={camp.id}
                onClick={() => {
                  playClickSound?.();
                  onSelectCampaign?.(camp.id);
                  onNavigate('product_detail');
                }}
                className="p-3.5 u-card u-card-hover cursor-pointer flex flex-col gap-3"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-22 h-22 rounded-xl overflow-hidden shrink-0 relative border border-slate-200/70">
                    <img
                      src={camp.imageUrl}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="font-bold text-emerald-600 truncate">
                          {camp.badge}
                        </span>
                        <span className="text-slate-400 font-mono shrink-0">
                          {camp.deadline}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold leading-snug mt-0.5 line-clamp-1">
                        {camp.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {camp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1.5">
                      <Users className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{camp.beneficiaries}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">
                      Raised{' '}
                      <strong className="font-bold text-slate-900">
                        RM {camp.raised.toLocaleString()}
                      </strong>{' '}
                      of RM {camp.target.toLocaleString()}
                    </span>
                    <span className="text-emerald-600 font-bold">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 u-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-0.5">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">
                      SPONSORSHIP SHARE
                    </span>
                    <div className="text-xs font-bold text-emerald-600 font-mono">
                      RM {camp.unitCost}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        / share
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleSponsor(e, camp)}
                    className="py-2 px-3.5 rounded-xl u-btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Pledged ✓</span>
                      </>
                    ) : (
                      <>
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>Sponsor Share</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map((camp) => {
            const progress = calculateCampaignProgress(camp.raised, camp.target);
            const isAdded = sponsoredId === camp.id;

            return (
              <div
                key={camp.id}
                onClick={() => {
                  playClickSound?.();
                  onSelectCampaign?.(camp.id);
                  onNavigate('product_detail');
                }}
                className="p-2.5 u-card u-card-hover cursor-pointer flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="h-24 rounded-xl overflow-hidden relative mb-2 border border-slate-200/70">
                    <img
                      src={camp.imageUrl}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 block truncate">
                    {camp.category} • {progress.percentage}%
                  </span>
                  <h3 className="text-xs font-bold leading-snug line-clamp-2 mt-0.5">
                    {camp.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    RM {camp.unitCost}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleSponsor(e, camp)}
                    className="py-1 px-2.5 rounded-lg u-btn-primary text-[10px] font-bold cursor-pointer"
                  >
                    {isAdded ? 'Added ✓' : 'Sponsor'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
