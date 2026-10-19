import React, { useState } from 'react';
import {
  Share2,
  Heart,
  CheckCircle2,
  MapPin,
  Users,
  HeartHandshake,
  Check,
  Receipt,
} from 'lucide-react';
import { ScreenId, CatalogItem } from '../../types/screens';
import { ASSETS } from '../../data/assets';
import { MRM_CAMPAIGNS } from './ListingCatalogScreen';
import { calculateCampaignProgress } from '../../utils/mrmLogic';

interface ProductDetailScreenProps {
  onNavigate: (screen: ScreenId) => void;
  playClickSound?: () => void;
  onAddToCart?: (item?: CatalogItem) => void;
  selectedCampaignId?: string;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  onNavigate,
  playClickSound,
  onAddToCart,
  selectedCampaignId = 'camp-2',
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [pledged, setPledged] = useState(false);
  const [selectedShares, setSelectedShares] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'provisions' | 'impact'>(() => {
    if (typeof window !== 'undefined') {
      const t = new URLSearchParams(window.location.search).get('tab');
      if (t === 'provisions' || t === 'impact') return t;
    }
    return 'overview';
  });

  const campaign =
    MRM_CAMPAIGNS.find((c) => c.id === selectedCampaignId) || MRM_CAMPAIGNS[1];
  const progress = calculateCampaignProgress(campaign.raised, campaign.target);

  const handleSponsor = () => {
    playClickSound?.();
    setPledged(true);
    for (let i = 0; i < selectedShares; i++) {
      onAddToCart?.({
        id: campaign.id,
        title: campaign.title,
        category: campaign.category,
        description: campaign.description,
        price: campaign.unitCost,
        imageUrl: campaign.imageUrl,
        coordinator: campaign.coordinator,
        location: campaign.location,
        rating: campaign.rating,
        reviewsCount: campaign.reviewsCount,
      });
    }
    setTimeout(() => {
      onNavigate('cart');
    }, 900);
  };

  return (
    <div className="relative min-h-full flex flex-col p-4 u-canvas pb-28 select-none space-y-3.5">
      {/* Main Campaign Hero Image */}
      <div className="relative h-52 rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hero-card">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {campaign.badge.toUpperCase()}
        </span>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              setIsLiked(!isLiked);
            }}
            className="w-8 h-8 rounded-xl bg-black/50 backdrop-blur-xs text-white flex items-center justify-center cursor-pointer"
            aria-label="Bookmark campaign"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => playClickSound?.()}
            className="w-8 h-8 rounded-xl bg-black/50 backdrop-blur-xs text-white flex items-center justify-center cursor-pointer"
            aria-label="Share campaign"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider block">
              {campaign.category} • {progress.percentage}% Funded
            </span>
            <h1 className="text-sm font-extrabold text-white leading-snug mt-0.5">
              {campaign.title}
            </h1>
          </div>
          <span className="text-xs font-mono font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-lg shrink-0">
            RM {campaign.unitCost} / Share
          </span>
        </div>
      </div>

      {/* Audit & Compliance Trust Tag */}
      <div className="p-3 u-card flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <div className="font-bold text-[11px] truncate">
              100% Tax-Exempt Contribution
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              LHDN Ref: 01/35/42/51/179 • Lembaga Zakat Partner
            </div>
          </div>
        </div>
        <span className="u-badge u-badge-brand text-[9px] shrink-0">
          ZAKAT ELIGIBLE
        </span>
      </div>

      {/* Segmented Tabs */}
      <div className="p-1 rounded-xl u-subtle border border-slate-200/80 grid grid-cols-3 gap-1">
        {(['overview', 'provisions', 'impact'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              playClickSound?.();
              setActiveTab(tab);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'overview'
              ? 'Overview'
              : tab === 'provisions'
              ? 'Provisions'
              : 'Impact'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>{campaign.description}</p>
          <p>
            Every contribution is audited by the MRM Welfare & Syariah Board and dispatched
            within 48 hours across {campaign.location}.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-3 u-card flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <span className="block font-bold text-[11px] truncate">
                  {campaign.location}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Direct field delivery
                </span>
              </div>
            </div>
            <div className="p-3 u-card flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <span className="block font-bold text-[11px] truncate">
                  {campaign.beneficiaries}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Verified recipients
                </span>
              </div>
            </div>
          </div>

          {/* Coordinator Profile */}
          <div className="p-3 u-card flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={ASSETS.avatars.sarah}
                alt={campaign.coordinator}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-xs truncate">{campaign.coordinator}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  MRM Lead Coordinator • Verified
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                onNavigate('chat');
              }}
              className="py-1.5 px-3 rounded-xl u-btn-secondary text-[11px] font-semibold cursor-pointer shrink-0"
            >
              Ask Inquiry
            </button>
          </div>
        </div>
      )}

      {activeTab === 'provisions' && (
        <div className="space-y-2">
          {[
            {
              item: 'Hardcover Noble Quran (Arabic + English & BM translation)',
              desc: 'High clarity typography with contextual notes for new Muslims.',
            },
            {
              item: 'Padded Travel Prayer Rug (Sajadah) & Halal Staples',
              desc: 'Essential daily spiritual and nutritional provisions.',
            },
            {
              item: 'Pictorial Step-by-Step Ablution (Wudu) & Daily Salah Manual',
              desc: 'Full-color diagrams with transliterated Arabic recitation.',
            },
            {
              item: 'Direct 1-on-1 Revert Mentor & Caseworker Assignment',
              desc: 'Continuous pastoral companionship and family guidance.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 u-card flex items-start gap-2.5 text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <div className="font-bold text-[11px]">{item.item}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="space-y-2.5">
          <div className="p-3.5 u-card">
            <div className="flex items-center justify-between mb-1 text-xs font-bold">
              <span>Brother Jason M. (Revert from Penang)</span>
              <span className="u-badge u-badge-brand text-[9px]">Verified</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              "Received my starter pack 2 days after taking Shahada at Masjid Wilayah. Having the pictorial solat guide and my mentor call me changed everything."
            </p>
          </div>
          <div className="p-3.5 u-card">
            <div className="flex items-center justify-between mb-1 text-xs font-bold">
              <span>Sister Sarah Wong (Revert from PJ)</span>
              <span className="u-badge u-badge-brand text-[9px]">Verified</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              "The sisterhood and patience of my mentor Ustazah Hana made me feel safe when my family needed time to understand my journey."
            </p>
          </div>
        </div>
      )}

      {/* Share Selector */}
      <div className="p-3.5 u-card">
        <div className="text-[11px] font-bold mb-2">
          Select Number of Sponsorship Shares:
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 5, 10].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => {
                playClickSound?.();
                setSelectedShares(count);
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedShares === count
                  ? 'u-btn-primary shadow-xs'
                  : 'u-subtle border-slate-200/80'
              }`}
            >
              {count} {count === 1 ? 'Share' : 'Shares'}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 inset-x-0 -mx-4 -mb-4 mt-2 p-3.5 u-surface border-t flex items-center justify-between z-20 shadow-lg">
        <div>
          <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">
            TOTAL PLEDGE ({selectedShares} {selectedShares === 1 ? 'SHARE' : 'SHARES'})
          </span>
          <div className="text-base font-extrabold text-emerald-600 font-mono">
            RM {(campaign.unitCost * selectedShares).toLocaleString()}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSponsor}
          className="min-h-[42px] py-2.5 px-5 rounded-xl u-btn-primary font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
        >
          {pledged ? (
            <>
              <Check className="w-4 h-4" />
              <span>Pledged to Basket ✓</span>
            </>
          ) : (
            <>
              <HeartHandshake className="w-4 h-4" />
              <span>Sponsor Infaq Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
