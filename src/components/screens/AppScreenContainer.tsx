import React, { useState } from 'react';
import {
  Home,
  HeartHandshake,
  Calendar,
  MessageSquare,
  User,
  Menu,
  ArrowLeft,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { ScreenId, CartItem, CatalogItem, ALL_SCREENS_META } from '../../types/screens';
import { UserRole } from '../../types';
import { ROLE_CONFIGS, RoleConfig } from '../../types/roleConfig';
import { AndroidRunModal } from '../mobile/modals/AndroidRunModal';
import { MrmLogoBadge } from '../mobile/MrmLogo';
import {
  calculateInfaqSummary,
  findNearestLocationZone,
  getLocationSyncSnapshot,
} from '../../utils/mrmLogic';
import { UtilityTabId } from '../../data/islamicUtilitiesData';
import { IslamicUtilitiesSheet } from '../mobile/IslamicUtilitiesSheet';

// All 20 screens
import { SplashScreen } from './SplashScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { SignUpScreen } from './SignUpScreen';
import { LoginScreen } from './LoginScreen';
import { HomeScreen } from './HomeScreen';
import { MenuNavigationScreen } from './MenuNavigationScreen';
import { DashboardScreen } from './DashboardScreen';
import { SearchScreen } from './SearchScreen';
import { ListingCatalogScreen } from './ListingCatalogScreen';
import { ProductDetailScreen } from './ProductDetailScreen';
import { ProfileScreen } from './ProfileScreen';
import { SettingsScreen } from './SettingsScreen';
import { CalendarBookingScreen } from './CalendarBookingScreen';
import { FeedSocialScreen } from './FeedSocialScreen';
import { ChatMessagingScreen } from './ChatMessagingScreen';
import { CartScreen } from './CartScreen';
import { CheckoutPaymentScreen } from './CheckoutPaymentScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { EmptyLoadingErrorScreen } from './EmptyLoadingErrorScreen';

import { ScreenNavigatorModal } from './ScreenNavigatorModal';

interface AppScreenContainerProps {
  initialScreen?: ScreenId;
  activeScreen?: ScreenId;
  onScreenChange?: (screen: ScreenId) => void;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  playClickSound?: (freq?: number) => void;
  isFullWidth?: boolean;
  onToggleFullWidth?: () => void;
  activeUtilityTab?: UtilityTabId | null;
  onUtilityTabChange?: (tab: UtilityTabId | null) => void;
  selectedZone?: string;
  onSelectZone?: (zone: string) => void;
  onSyncGpsLocation?: () => void;
  isSyncingGps?: boolean;
}

export const AppScreenContainer: React.FC<AppScreenContainerProps> = ({
  initialScreen = 'home',
  activeScreen,
  onScreenChange,
  currentRole = 'staff_admin',
  onRoleChange,
  theme = 'light',
  onToggleTheme,
  playClickSound,
  activeUtilityTab,
  onUtilityTabChange,
  selectedZone: externalZone,
  onSelectZone,
  onSyncGpsLocation,
  isSyncingGps: externalSyncingGps,
}) => {
  const [internalScreen, setInternalScreen] = useState<ScreenId>(initialScreen);
  const currentScreen = activeScreen ?? internalScreen;

  const [internalUtilityTab, setInternalUtilityTab] = useState<UtilityTabId | null>(null);
  const currentUtilityTab =
    activeUtilityTab !== undefined ? activeUtilityTab : internalUtilityTab;

  const setUtilityTab = (tab: UtilityTabId | null) => {
    setInternalUtilityTab(tab);
    onUtilityTabChange?.(tab);
  };

  const [isNavigatorOpen, setIsNavigatorOpen] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('modal') === 'navigator'
  );
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('modal') === 'role_picker'
  );
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('modal') === 'android_apk'
  );

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('camp-2');
  const [internalZone, setInternalZone] = useState<string>(
    'WLY01 - Kuala Lumpur & Putrajaya'
  );
  const [internalSyncingGps, setInternalSyncingGps] = useState<boolean>(false);

  const selectedZone = externalZone ?? internalZone;
  const isSyncingGps = externalSyncingGps ?? internalSyncingGps;

  const handleZoneChange = (newZone: string) => {
    setInternalZone(newZone);
    onSelectZone?.(newZone);
  };

  const handleSyncGps = () => {
    if (onSyncGpsLocation) {
      onSyncGpsLocation();
      return;
    }
    setInternalSyncingGps(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = findNearestLocationZone(
            pos.coords.latitude,
            pos.coords.longitude
          );
          handleZoneChange(nearest.zone.fullLabel);
          setInternalSyncingGps(false);
        },
        () => {
          setInternalSyncingGps(false);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => setInternalSyncingGps(false), 500);
    }
  };

  const [fuelTopUp, setFuelTopUp] = useState<number>(15);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'camp-1',
      title: 'Emergency Asnaf Halal Grocery & Staples Box',
      subtitle: 'Nutritional sustenance for 1 needy family (4 pax)',
      price: 120,
      quantity: 1,
      category: 'Food Relief',
      iconName: 'Package',
    },
    {
      id: 'camp-2',
      title: 'New Revert (Muallaf) Starter Kit & Mentorship',
      subtitle: 'Noble Quran, prayer rug, solat manual & 6mo mentor',
      price: 85,
      quantity: 1,
      category: 'Revert Care',
      iconName: 'Book',
    },
  ]);

  const currentMeta =
    ALL_SCREENS_META.find((s) => s.id === currentScreen) || ALL_SCREENS_META[5];
  const roleMeta: RoleConfig = ROLE_CONFIGS[currentRole] || ROLE_CONFIGS.staff_admin;
  const locationSnap = getLocationSyncSnapshot(selectedZone);

  const handleNavigate = (screen: ScreenId) => {
    playClickSound?.();
    setUtilityTab(null);
    setInternalScreen(screen);
    onScreenChange?.(screen);
  };

  const handleOpenUtility = (tab: UtilityTabId) => {
    playClickSound?.(860);
    setUtilityTab(tab);
  };

  const handleAddToCart = (item?: CatalogItem) => {
    playClickSound?.();
    if (item) {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [
          ...prev,
          {
            id: item.id,
            title: item.title,
            subtitle: item.category,
            price: item.price,
            quantity: 1,
            category: item.category,
            iconName: 'Heart',
          },
        ];
      });
    } else {
      setCartItems((prev) =>
        prev.map((i, idx) => (idx === 0 ? { ...i, quantity: i.quantity + 1 } : i))
      );
    }
  };

  const infaqSummary = calculateInfaqSummary(cartItems, fuelTopUp);
  const totalCartCount = infaqSummary.totalShares;

  const isAuthScreen = ['splash', 'onboarding', 'welcome', 'login', 'signup'].includes(
    currentScreen
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onNavigate={handleNavigate} playClickSound={playClickSound} />;
      case 'onboarding':
        return (
          <OnboardingScreen onNavigate={handleNavigate} playClickSound={playClickSound} />
        );
      case 'welcome':
        return (
          <WelcomeScreen onNavigate={handleNavigate} playClickSound={playClickSound} />
        );
      case 'signup':
        return <SignUpScreen onNavigate={handleNavigate} playClickSound={playClickSound} />;
      case 'login':
        return <LoginScreen onNavigate={handleNavigate} playClickSound={playClickSound} />;
      case 'home':
        return (
          <HomeScreen
            currentRole={currentRole}
            onRoleChange={onRoleChange}
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            onOpenUtility={handleOpenUtility}
            selectedZone={selectedZone}
            onSelectZone={handleZoneChange}
            onSyncGpsLocation={handleSyncGps}
            isSyncingGps={isSyncingGps}
          />
        );
      case 'menu':
        return (
          <MenuNavigationScreen
            currentRole={currentRole}
            onRoleChange={onRoleChange}
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onOpenNavigator={() => setIsNavigatorOpen(true)}
            onOpenUtility={handleOpenUtility}
            selectedZone={selectedZone}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            currentRole={currentRole}
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            onAddToCart={handleAddToCart}
          />
        );
      case 'search':
        return (
          <SearchScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            onOpenUtility={handleOpenUtility}
            selectedZone={selectedZone}
          />
        );
      case 'catalog':
        return (
          <ListingCatalogScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            onAddToCart={handleAddToCart}
            cartCount={totalCartCount}
            onSelectCampaign={(id) => setSelectedCampaignId(id)}
          />
        );
      case 'product_detail':
        return (
          <ProductDetailScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            onAddToCart={handleAddToCart}
            selectedCampaignId={selectedCampaignId}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            currentRole={currentRole}
            onRoleChange={onRoleChange}
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onOpenNavigator={() => setIsNavigatorOpen(true)}
            selectedZone={selectedZone}
            onSelectZone={handleZoneChange}
            onSyncGpsLocation={handleSyncGps}
            isSyncingGps={isSyncingGps}
          />
        );
      case 'calendar_booking':
        return (
          <CalendarBookingScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            onOpenUtility={handleOpenUtility}
            selectedZone={selectedZone}
            onSelectZone={handleZoneChange}
          />
        );
      case 'feed':
        return (
          <FeedSocialScreen onNavigate={handleNavigate} playClickSound={playClickSound} />
        );
      case 'chat':
        return (
          <ChatMessagingScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
          />
        );
      case 'cart':
        return (
          <CartScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            cartItems={cartItems}
            onUpdateCart={setCartItems}
            fuelTopUp={fuelTopUp}
            onUpdateFuelTopUp={setFuelTopUp}
          />
        );
      case 'checkout':
        return (
          <CheckoutPaymentScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            totalAmount={infaqSummary.total}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
          />
        );
      case 'empty_loading_error':
        return (
          <EmptyLoadingErrorScreen
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
          />
        );
      default:
        return (
          <HomeScreen
            currentRole={currentRole}
            onRoleChange={onRoleChange}
            onNavigate={handleNavigate}
            playClickSound={playClickSound}
            onOpenUtility={handleOpenUtility}
            selectedZone={selectedZone}
            onSelectZone={handleZoneChange}
            onSyncGpsLocation={handleSyncGps}
            isSyncingGps={isSyncingGps}
          />
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col u-canvas relative overflow-hidden select-none">

      {/* ===================================================================== */}
      {/* DE-DENSED MOBILE TOP BAR                                              */}
      {/* Left: Real MRM Logo + Un-truncated Brand / Screen Title               */}
      {/* Right: Islamic Utilities Hub, Pledge Basket, Human Role Icon, Menu    */}
      {/* ===================================================================== */}
      {!isAuthScreen && (
        <header className="shrink-0 px-3.5 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] u-surface border-b flex items-center justify-between gap-2 z-30 relative">
          {/* Left: Real MRM Logo + Brand or Back Navigation */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {currentScreen === 'home' ? (
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className="flex items-center gap-2.5 text-left cursor-pointer min-w-0"
              >
                <MrmLogoBadge size="sm" />
                <div className="min-w-0">
                  <div className="text-sm font-extrabold tracking-tight leading-none truncate">
                    MRM Care
                  </div>
                  <span className="block text-[10px] text-slate-500 font-medium truncate mt-0.5">
                    Multiracial Reverted Muslims
                  </span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="w-8 h-8 rounded-xl u-btn-secondary flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="Back to Home"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold tracking-tight truncate">
                      {currentMeta.title}
                    </span>
                  </div>
                  <span className="block text-[10px] text-emerald-600 font-mono font-semibold truncate">
                    Screen #{currentMeta.number} · {roleMeta.shortLabel}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Clean Icon Buttons (Islamic Utilities Hub, Infaq Basket, Human Role Icon, Sidebar Menu) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* 0. MRM Islamic Utilities Hub Quick Toggle */}
            <button
              type="button"
              onClick={() =>
                setUtilityTab(currentUtilityTab ? null : 'waqt')
              }
              className={`relative w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                currentUtilityTab ? 'u-btn-primary' : 'u-btn-secondary'
              }`}
              aria-label="MRM Islamic Utilities Suite"
              title="MRM Islamic Utilities Suite"
            >
              <Compass
                className={`w-4 h-4 ${
                  currentUtilityTab ? 'text-white' : 'text-emerald-600'
                }`}
              />
            </button>

            {/* 1. Infaq Pledge Basket */}
            <button
              type="button"
              onClick={() => handleNavigate('cart')}
              className="relative w-8 h-8 rounded-xl u-btn-secondary flex items-center justify-center cursor-pointer"
              aria-label="Sadaqah & Infaq Basket"
              title="Sadaqah & Infaq Basket"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* 2. Human Icon Role Switcher */}
            <button
              type="button"
              onClick={() => {
                playClickSound?.();
                setIsRolePickerOpen((prev) => !prev);
              }}
              className={`relative w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                isRolePickerOpen ? 'u-btn-primary' : 'u-btn-secondary'
              }`}
              aria-label={`Switch Operating Role (Current: ${roleMeta.shortLabel})`}
              title={`Operating Role: ${roleMeta.shortLabel}`}
            >
              <User className="w-4 h-4" />
            </button>

            {/* 3. Sidebar Menu (Contains Theme Switcher & 20-Screen Directory) */}
            <button
              type="button"
              onClick={() =>
                handleNavigate(currentScreen === 'menu' ? 'home' : 'menu')
              }
              className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                currentScreen === 'menu' ? 'u-btn-primary' : 'u-btn-secondary'
              }`}
              aria-label="Open Sidebar Menu & Theme Settings"
              title="Sidebar Menu, Theme & 20-Screen Directory"
            >
              {currentScreen === 'menu' ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Human Icon Role Switcher Popover */}
          {isRolePickerOpen && (
            <div className="absolute top-full right-3 mt-1.5 w-68 u-card p-2.5 shadow-2xl z-50 animate-fade-in">
              <div className="px-2 py-1.5 border-b border-slate-200/70 mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Select Role Persona
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRolePickerOpen(false)}
                  className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Close role menu"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                {(Object.keys(ROLE_CONFIGS) as UserRole[]).map((rKey) => {
                  const cfg = ROLE_CONFIGS[rKey];
                  const active = currentRole === rKey;
                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => {
                        playClickSound?.(850);
                        onRoleChange?.(rKey);
                        setIsRolePickerOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl flex items-center justify-between gap-2.5 text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'hover:bg-slate-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={cfg.avatarUrl}
                          alt={cfg.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">
                            {cfg.shortLabel}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              active ? 'text-emerald-100' : 'text-slate-500'
                            }`}
                          >
                            {cfg.name}
                          </div>
                        </div>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main Active Screen Scrollable Viewport */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
        {renderCurrentScreen()}
      </div>

      {/* Bottom Fixed Navigation Bar */}
      {!isAuthScreen && (
        <nav
          aria-label="Mobile Bottom Navigation"
          className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 min-h-[64px] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 px-4 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
        >
          {[
            { id: 'home' as ScreenId, label: 'Home', icon: Home },
            { id: 'catalog' as ScreenId, label: 'Relief', icon: HeartHandshake },
            { id: 'calendar_booking' as ScreenId, label: 'Schedule', icon: Calendar },
            { id: 'feed' as ScreenId, label: 'Feed', icon: MessageSquare },
            { id: 'profile' as ScreenId, label: 'Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentScreen === tab.id ||
              (tab.id === 'catalog' &&
                ['product_detail', 'cart', 'checkout'].includes(currentScreen)) ||
              (tab.id === 'profile' && currentScreen === 'settings');

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleNavigate(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer min-w-[58px] min-h-[44px] ${
                  isActive
                    ? 'text-emerald-600 font-bold'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* MRM 9-Module Islamic Utilities Suite Sheet */}
      <IslamicUtilitiesSheet
        isOpen={currentUtilityTab !== null}
        onClose={() => setUtilityTab(null)}
        initialTab={currentUtilityTab || 'waqt'}
        selectedZone={selectedZone}
        onSelectZone={handleZoneChange}
        playClickSound={playClickSound}
        onAddToCart={handleAddToCart}
      />

      {/* Modals */}
      <ScreenNavigatorModal
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={handleNavigate}
        playClickSound={playClickSound}
      />

      <AndroidRunModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        appUrl={typeof window !== 'undefined' ? window.location.href : 'https://mrm.org.my'}
      />
    </div>
  );
};
