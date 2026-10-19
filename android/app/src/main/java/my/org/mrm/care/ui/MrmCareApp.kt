package my.org.mrm.care.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import my.org.mrm.care.domain.MrmLogic
import my.org.mrm.care.model.*
import my.org.mrm.care.ui.components.MrmLogoBadge
import my.org.mrm.care.ui.theme.*
import java.util.Locale
import kotlin.math.cos
import kotlin.math.sin

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MrmCareApp() {
    var isDarkTheme by remember { mutableStateOf(false) }
    var activeScreen by remember { mutableStateOf(ScreenId.HOME) }
    var currentRole by remember { mutableStateOf(UserRolePersona.STAFF_ADMIN) }
    var selectedZone by remember { mutableStateOf("WLY01") }
    var customCoords by remember { mutableStateOf<Pair<Double, Double>?>(null) }
    var selectedItem by remember { mutableStateOf(MrmSampleData.CATALOG_ITEMS.first()) }
    var cartItems by remember {
        mutableStateOf(
            listOf(
                CartItem(MrmSampleData.CATALOG_ITEMS[0], 1),
                CartItem(MrmSampleData.CATALOG_ITEMS[1], 1)
            )
        )
    }

    var showRolePickerDialog by remember { mutableStateOf(false) }
    var showZonePickerDialog by remember { mutableStateOf(false) }
    var showScreenSwitcherSheet by remember { mutableStateOf(false) }
    var showIslamicUtilitiesSheet by remember { mutableStateOf(false) }
    var activeUtilityTab by remember { mutableStateOf("waqt") }
    var privacyMaskAmounts by remember { mutableStateOf(false) }
    var toastMessage by remember { mutableStateOf<String?>(null) }

    val locationSnap = remember(selectedZone, customCoords) {
        MrmLogic.getLocationSyncSnapshot(selectedZone, 946, customCoords)
    }

    val infaqSummary = remember(cartItems) {
        MrmLogic.calculateInfaqSummary(cartItems, includeLogisticsSupport = true)
    }

    val addToCart: (CatalogItem) -> Unit = { item ->
        val existing = cartItems.find { it.item.id == item.id }
        cartItems = if (existing != null) {
            cartItems.map {
                if (it.item.id == item.id) it.copy(quantity = it.quantity + 1) else it
            }
        } else {
            cartItems + CartItem(item, 1)
        }
        toastMessage = "Added ${item.title} to Infaq Basket"
    }

    val syncGpsCoordinates: () -> Unit = {
        val currentIdx = MrmSampleData.LOCATION_ZONES.indexOfFirst { it.code == selectedZone }
        val nextZone = MrmSampleData.LOCATION_ZONES[(currentIdx + 1) % MrmSampleData.LOCATION_ZONES.size]
        selectedZone = nextZone.code
        customCoords = Pair(nextZone.latitude, nextZone.longitude)
        toastMessage = "GPS synced: ${nextZone.city} (${nextZone.code}) • Qibla ${MrmLogic.calculateQiblaDirection(nextZone.latitude, nextZone.longitude).first}°"
    }

    val isAuthScreen = activeScreen in listOf(
        ScreenId.SPLASH,
        ScreenId.ONBOARDING,
        ScreenId.WELCOME,
        ScreenId.LOGIN,
        ScreenId.REGISTER
    )

    MrmCareTheme(darkTheme = isDarkTheme) {
        val surfaceColor = MaterialTheme.colorScheme.surface
        val canvasColor = MaterialTheme.colorScheme.background
        val borderColor = MaterialTheme.colorScheme.outline
        val textPrimary = MaterialTheme.colorScheme.onSurface
        val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

        Scaffold(
            containerColor = canvasColor,
            topBar = {
                if (!isAuthScreen) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(surfaceColor)
                            .statusBarsPadding()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 14.dp, vertical = 10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Left: Official MRM Multi-Colored 3-Arch Logo + Brand or Back Navigation
                            if (activeScreen == ScreenId.HOME) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .weight(1f)
                                        .clickable { activeScreen = ScreenId.HOME }
                                ) {
                                    MrmLogoBadge(width = 42.dp, height = 30.dp)
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column(modifier = Modifier.weight(1f, fill = false)) {
                                        Text(
                                            text = "MRM Care",
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = textPrimary,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Text(
                                            text = "Multiracial Reverted Muslims",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = textSecondary,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }
                                }
                            } else {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.weight(1f)
                                ) {
                                    HeaderIconButton(
                                        icon = Icons.Default.ArrowBack,
                                        contentDescription = "Back to Home",
                                        tint = textPrimary,
                                        onClick = { activeScreen = ScreenId.HOME }
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column(modifier = Modifier.weight(1f, fill = false)) {
                                        Text(
                                            text = activeScreen.title,
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = textPrimary,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Text(
                                            text = "Screen #${activeScreen.ordinal + 1} • ${currentRole.shortLabel}",
                                            fontSize = 10.sp,
                                            fontFamily = FontFamily.Monospace,
                                            fontWeight = FontWeight.SemiBold,
                                            color = Emerald600,
                                            maxLines = 1
                                        )
                                    }
                                }
                            }

                            // Right: 4 Crisp Rounded-XL Icon Buttons (Exact Match with Web App)
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(5.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // 1. MRM Islamic Utilities Hub Toggle
                                HeaderIconButton(
                                    icon = Icons.Default.Explore,
                                    contentDescription = "MRM Islamic Utilities Suite",
                                    tint = if (showIslamicUtilitiesSheet) Color.White else Emerald600,
                                    isActive = showIslamicUtilitiesSheet,
                                    onClick = {
                                        activeUtilityTab = "waqt"
                                        showIslamicUtilitiesSheet = true
                                    }
                                )

                                // 2. Infaq Pledge Basket with Count Badge
                                Box {
                                    HeaderIconButton(
                                        icon = Icons.Default.VolunteerActivism,
                                        contentDescription = "Sadaqah & Infaq Basket",
                                        tint = Emerald600,
                                        onClick = { activeScreen = ScreenId.CART }
                                    )
                                    if (infaqSummary.totalShares > 0) {
                                        Box(
                                            modifier = Modifier
                                                .align(Alignment.TopEnd)
                                                .offset(x = 3.dp, y = (-3).dp)
                                                .defaultMinSize(minWidth = 15.dp, minHeight = 15.dp)
                                                .background(Emerald600, CircleShape)
                                                .padding(horizontal = 3.dp),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = "${infaqSummary.totalShares}",
                                                color = Color.White,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }

                                // 3. Operating Role Persona Switcher
                                HeaderIconButton(
                                    icon = Icons.Default.Person,
                                    contentDescription = "Switch Operating Role",
                                    tint = if (showRolePickerDialog) Color.White else textPrimary,
                                    isActive = showRolePickerDialog,
                                    onClick = { showRolePickerDialog = true }
                                )

                                // 4. Sidebar Menu & Theme Switcher
                                HeaderIconButton(
                                    icon = if (activeScreen == ScreenId.MENU) Icons.Default.Close else Icons.Default.Menu,
                                    contentDescription = "Menu & Theme Settings",
                                    tint = if (activeScreen == ScreenId.MENU) Color.White else textPrimary,
                                    isActive = activeScreen == ScreenId.MENU,
                                    onClick = {
                                        activeScreen = if (activeScreen == ScreenId.MENU) ScreenId.HOME else ScreenId.MENU
                                    }
                                )
                            }
                        }
                        HorizontalDivider(thickness = 1.dp, color = borderColor)
                    }
                }
            },
            bottomBar = {
                if (!isAuthScreen) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(surfaceColor)
                            .navigationBarsPadding()
                    ) {
                        HorizontalDivider(thickness = 1.dp, color = borderColor)
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(64.dp)
                                .padding(horizontal = 8.dp),
                            horizontalArrangement = Arrangement.SpaceAround,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            val navTabs = listOf(
                                Triple(ScreenId.HOME, "Home", Icons.Default.Home),
                                Triple(ScreenId.CATALOG, "Relief", Icons.Default.VolunteerActivism),
                                Triple(ScreenId.CALENDAR, "Schedule", Icons.Default.CalendarToday),
                                Triple(ScreenId.CHAT_LIST, "Feed", Icons.Default.ChatBubbleOutline),
                                Triple(ScreenId.PROFILE, "Profile", Icons.Default.Person)
                            )
                            navTabs.forEach { (tabScreen, label, icon) ->
                                val isSelected = activeScreen == tabScreen ||
                                        (tabScreen == ScreenId.CATALOG && activeScreen in listOf(ScreenId.DETAIL, ScreenId.CART, ScreenId.CHECKOUT)) ||
                                        (tabScreen == ScreenId.PROFILE && activeScreen == ScreenId.SETTINGS)
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Center,
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .clickable { activeScreen = tabScreen }
                                        .padding(horizontal = 12.dp, vertical = 6.dp)
                                ) {
                                    Icon(
                                        imageVector = icon,
                                        contentDescription = label,
                                        tint = if (isSelected) Emerald600 else Slate400,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = label,
                                        fontSize = 10.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                        color = if (isSelected) Emerald600 else Slate400
                                    )
                                }
                            }
                        }
                    }
                }
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .background(canvasColor)
            ) {
                when (activeScreen) {
                    ScreenId.SPLASH -> SplashScreenView(onContinue = { activeScreen = ScreenId.ONBOARDING })
                    ScreenId.ONBOARDING -> OnboardingScreenView(onContinue = { activeScreen = ScreenId.WELCOME })
                    ScreenId.WELCOME -> WelcomeScreenView(
                        onSignIn = { activeScreen = ScreenId.LOGIN },
                        onSignUp = { activeScreen = ScreenId.REGISTER },
                        onSkipHome = { activeScreen = ScreenId.HOME }
                    )
                    ScreenId.LOGIN -> LoginScreenView(
                        onLoginSuccess = { activeScreen = ScreenId.HOME },
                        onRegister = { activeScreen = ScreenId.REGISTER }
                    )
                    ScreenId.REGISTER -> RegisterScreenView(
                        onVerify = { activeScreen = ScreenId.HOME },
                        onBackToLogin = { activeScreen = ScreenId.LOGIN }
                    )
                    ScreenId.HOME -> HomeScreenView(
                        currentRole = currentRole,
                        locationSnap = locationSnap,
                        onOpenZonePicker = { showZonePickerDialog = true },
                        onSyncGps = syncGpsCoordinates,
                        onOpenIslamicSuite = { tab ->
                            activeUtilityTab = tab
                            showIslamicUtilitiesSheet = true
                        },
                        onNavigate = { activeScreen = it },
                        onSelectCatalogItem = { item ->
                            selectedItem = item
                            activeScreen = ScreenId.DETAIL
                        },
                        onShowToast = { toastMessage = it }
                    )
                    ScreenId.MENU -> MenuDrawerScreenView(
                        currentRole = currentRole,
                        locationSnap = locationSnap,
                        isDarkTheme = isDarkTheme,
                        onToggleTheme = { isDarkTheme = !isDarkTheme },
                        onNavigate = { activeScreen = it },
                        onOpenIslamicSuite = { tab ->
                            activeUtilityTab = tab
                            showIslamicUtilitiesSheet = true
                        },
                        onOpenScreenDirectory = { showScreenSwitcherSheet = true }
                    )
                    ScreenId.SEARCH -> SearchScreenView(
                        locationSnap = locationSnap,
                        onSelectItem = {
                            selectedItem = it
                            activeScreen = ScreenId.DETAIL
                        },
                        onOpenIslamicSuite = { tab ->
                            activeUtilityTab = tab
                            showIslamicUtilitiesSheet = true
                        }
                    )
                    ScreenId.CATALOG -> CatalogScreenView(
                        onSelectItem = {
                            selectedItem = it
                            activeScreen = ScreenId.DETAIL
                        },
                        onGoToCart = { activeScreen = ScreenId.CART },
                        cartCount = infaqSummary.totalShares
                    )
                    ScreenId.DETAIL -> DetailScreenView(
                        item = selectedItem,
                        onAddToCart = {
                            addToCart(selectedItem)
                            activeScreen = ScreenId.CART
                        }
                    )
                    ScreenId.CART -> CartScreenView(
                        cartItems = cartItems,
                        summary = infaqSummary,
                        onUpdateQty = { id, delta ->
                            cartItems = cartItems.mapNotNull { entry ->
                                if (entry.item.id == id) {
                                    val nextQty = entry.quantity + delta
                                    if (nextQty > 0) entry.copy(quantity = nextQty) else null
                                } else entry
                            }
                        },
                        onCheckout = { activeScreen = ScreenId.CHECKOUT }
                    )
                    ScreenId.CHECKOUT -> CheckoutScreenView(
                        summary = infaqSummary,
                        onComplete = {
                            toastMessage = "JazakAllahu Khayran • LHDN Sec 44(6) Receipt Issued"
                            activeScreen = ScreenId.STATS
                        }
                    )
                    ScreenId.CALENDAR -> CalendarPrayerScreenView(
                        locationSnap = locationSnap,
                        onOpenZonePicker = { showZonePickerDialog = true },
                        onOpenIslamicSuite = { tab ->
                            activeUtilityTab = tab
                            showIslamicUtilitiesSheet = true
                        }
                    )
                    ScreenId.NOTIFICATIONS -> NotificationsScreenView(onNavigate = { activeScreen = it })
                    ScreenId.CHAT_LIST -> ChatListScreenView(onOpenChat = { activeScreen = ScreenId.CHAT_DETAIL })
                    ScreenId.CHAT_DETAIL -> ChatDetailScreenView()
                    ScreenId.UPLOAD -> UploadReportScreenView(onSubmitted = { activeScreen = ScreenId.STATS })
                    ScreenId.STATS -> StatsLedgerScreenView(privacyMaskAmounts = privacyMaskAmounts)
                    ScreenId.PROFILE -> ProfileScreenView(
                        currentRole = currentRole,
                        onSwitchRole = { showRolePickerDialog = true },
                        onOpenSettings = { activeScreen = ScreenId.SETTINGS }
                    )
                    ScreenId.SETTINGS -> SettingsScreenView(
                        locationSnap = locationSnap,
                        isDarkTheme = isDarkTheme,
                        onToggleTheme = { isDarkTheme = !isDarkTheme },
                        onSelectZone = { zoneCode ->
                            selectedZone = zoneCode
                            customCoords = null
                        },
                        onSyncGps = syncGpsCoordinates,
                        privacyMaskAmounts = privacyMaskAmounts,
                        onTogglePrivacy = { privacyMaskAmounts = !privacyMaskAmounts },
                        onOpenDirectory = { showScreenSwitcherSheet = true },
                        onNavigate = { activeScreen = it }
                    )
                }

                // Floating Toast Banner (Exact Match with Web App)
                toastMessage?.let { msg ->
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = surfaceColor,
                        border = BorderStroke(1.dp, Emerald500),
                        shadowElevation = 8.dp,
                        modifier = Modifier
                            .align(Alignment.TopCenter)
                            .padding(horizontal = 16.dp, vertical = 10.dp)
                            .fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = Emerald600,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = msg,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = textPrimary
                                )
                            }
                            TextButton(onClick = { toastMessage = null }) {
                                Text("✕", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = textSecondary)
                            }
                        }
                    }
                }
            }
        }

        // 1. Role Persona Switcher Dialog (All 6 Roles Matching Web App)
        if (showRolePickerDialog) {
            AlertDialog(
                onDismissRequest = { showRolePickerDialog = false },
                containerColor = surfaceColor,
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = Emerald600)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Select Role Persona (6 Roles)",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = textPrimary
                        )
                    }
                },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        UserRolePersona.entries.forEach { role ->
                            val isSelected = role == currentRole
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSelected) Emerald600 else MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        currentRole = role
                                        showRolePickerDialog = false
                                        toastMessage = "Switched to ${role.shortLabel} Workspace (${role.fullName})"
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column {
                                        Text(
                                            text = role.shortLabel,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Color.White else textPrimary
                                        )
                                        Text(
                                            text = "${role.fullName} • ${role.badgeTitle}",
                                            fontSize = 10.sp,
                                            color = if (isSelected) Emerald100 else textSecondary
                                        )
                                    }
                                    if (isSelected) {
                                        Icon(
                                            imageVector = Icons.Default.Check,
                                            contentDescription = null,
                                            tint = Color.White,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showRolePickerDialog = false }) {
                        Text("Close", color = Emerald600, fontWeight = FontWeight.Bold)
                    }
                }
            )
        }

        // 2. Location Zone Switcher Dialog (All 12 JAKIM & Global Zones)
        if (showZonePickerDialog) {
            AlertDialog(
                onDismissRequest = { showZonePickerDialog = false },
                containerColor = surfaceColor,
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Place, contentDescription = null, tint = Emerald600)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Select JAKIM / Global Prayer Zone",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = textPrimary
                        )
                    }
                },
                text = {
                    LazyColumn(
                        modifier = Modifier.heightIn(max = 360.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(MrmSampleData.LOCATION_ZONES) { z ->
                            val isSelected = z.code == locationSnap.zone.code
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSelected) Emerald600 else MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        selectedZone = z.code
                                        customCoords = null
                                        showZonePickerDialog = false
                                        val nextSnap = MrmLogic.getLocationSyncSnapshot(z.code)
                                        toastMessage = "Location synced to ${z.city} (${z.code}) • Qibla ${nextSnap.qiblaBearing}°"
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = "${z.city} · ${z.code}",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Color.White else textPrimary
                                        )
                                        Text(
                                            text = "${z.hubName} (${z.authority})",
                                            fontSize = 10.sp,
                                            color = if (isSelected) Emerald100 else textSecondary
                                        )
                                    }
                                    if (isSelected) {
                                        Icon(
                                            imageVector = Icons.Default.Check,
                                            contentDescription = null,
                                            tint = Color.White,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showZonePickerDialog = false }) {
                        Text("Close", color = Emerald600, fontWeight = FontWeight.Bold)
                    }
                }
            )
        }

        // 3. MRM Complete 9-Module Islamic Utilities Sheet
        if (showIslamicUtilitiesSheet) {
            ModalBottomSheet(
                onDismissRequest = { showIslamicUtilitiesSheet = false },
                containerColor = canvasColor
            ) {
                IslamicUtilitiesBottomSheetContent(
                    activeTab = activeUtilityTab,
                    onSelectTab = { activeUtilityTab = it },
                    locationSnap = locationSnap,
                    onSelectZone = { zoneCode ->
                        selectedZone = zoneCode
                        customCoords = null
                    },
                    onSyncGps = syncGpsCoordinates,
                    onClose = { showIslamicUtilitiesSheet = false }
                )
            }
        }

        // 4. 20-Screen Master Directory Sheet
        if (showScreenSwitcherSheet) {
            ModalBottomSheet(
                onDismissRequest = { showScreenSwitcherSheet = false },
                containerColor = surfaceColor
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "MRM Care • 20-Screen Mobile System",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = textPrimary
                    )
                    Text(
                        text = "Active: #${activeScreen.ordinal + 1} ${activeScreen.title}",
                        fontSize = 12.sp,
                        color = textSecondary,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )
                    LazyColumn(
                        modifier = Modifier.heightIn(max = 420.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(ScreenId.entries) { screen ->
                            val isSelected = screen == activeScreen
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSelected) Emerald50 else MaterialTheme.colorScheme.surfaceVariant,
                                border = if (isSelected) BorderStroke(1.dp, Emerald500) else null,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        activeScreen = screen
                                        showScreenSwitcherSheet = false
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = String.format(Locale.US, "%02d", screen.ordinal + 1),
                                            fontFamily = FontFamily.Monospace,
                                            fontSize = 11.sp,
                                            color = Slate400,
                                            modifier = Modifier.width(24.dp)
                                        )
                                        Column {
                                            Text(
                                                text = screen.title,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 13.sp,
                                                color = if (isSelected) Emerald800 else textPrimary
                                            )
                                            Text(
                                                text = screen.category,
                                                fontSize = 10.sp,
                                                color = textSecondary
                                            )
                                        }
                                    }
                                    if (isSelected) {
                                        Icon(
                                            imageVector = Icons.Default.CheckCircle,
                                            contentDescription = null,
                                            tint = Emerald600,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(20.dp))
                }
            }
        }
    }
}

@Composable
private fun HeaderIconButton(
    icon: ImageVector,
    contentDescription: String,
    tint: Color,
    isActive: Boolean = false,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(11.dp),
        color = if (isActive) Emerald600 else MaterialTheme.colorScheme.surface,
        border = BorderStroke(
            width = 1.dp,
            color = if (isActive) Emerald600 else MaterialTheme.colorScheme.outline
        ),
        modifier = Modifier
            .size(34.dp)
            .clickable(onClick = onClick)
    ) {
        Box(contentAlignment = Alignment.Center) {
            Icon(
                imageVector = icon,
                contentDescription = contentDescription,
                tint = tint,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

@Composable
private fun HomeScreenView(
    currentRole: UserRolePersona,
    locationSnap: LocationSyncSnapshot,
    onOpenZonePicker: () -> Unit,
    onSyncGps: () -> Unit,
    onOpenIslamicSuite: (String) -> Unit,
    onNavigate: (ScreenId) -> Unit,
    onSelectCatalogItem: (CatalogItem) -> Unit,
    onShowToast: (String) -> Unit
) {
    val prayers = locationSnap.prayers
    val nextPrayerInfo = locationSnap.nextPrayerInfo
    val almanac = locationSnap.almanac
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    var assignedSquadIds by remember { mutableStateOf(setOf<String>()) }
    var isOnDuty by remember { mutableStateOf(true) }
    var missionAccepted by remember { mutableStateOf(false) }
    var skpUploaded by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // =========================================================================
        // 1. SIGNATURE EMERALD ARCHITECTURAL HERO CARD WITH LOCATION SYNC & WAQT
        // =========================================================================
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        brush = Brush.linearGradient(
                            colors = listOf(Emerald800, Emerald700, Emerald900)
                        )
                    )
                    .padding(16.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    // Row 1: Top Location & Qibla Sync Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Place,
                                contentDescription = null,
                                tint = Emerald300,
                                modifier = Modifier.size(14.dp)
                            )
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Color.White.copy(alpha = 0.12f),
                                modifier = Modifier.clickable(onClick = onOpenZonePicker)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(3.dp)
                                ) {
                                    Text(
                                        text = "${locationSnap.zone.city} · ${locationSnap.zone.code}",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Emerald50,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Icon(
                                        imageVector = Icons.Default.KeyboardArrowDown,
                                        contentDescription = null,
                                        tint = Emerald200,
                                        modifier = Modifier.size(13.dp)
                                    )
                                }
                            }
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Color.White.copy(alpha = 0.16f),
                                modifier = Modifier.clickable(onClick = onSyncGps)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(3.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Sync,
                                        contentDescription = "GPS",
                                        tint = Color.White,
                                        modifier = Modifier.size(11.dp)
                                    )
                                    Text(
                                        text = "GPS",
                                        fontSize = 10.sp,
                                        fontFamily = FontFamily.Monospace,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                            modifier = Modifier.clickable { onOpenIslamicSuite("qibla") }
                        ) {
                            Icon(
                                imageVector = Icons.Default.Explore,
                                contentDescription = null,
                                tint = Gold300,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = "${locationSnap.qiblaBearing}° WNW",
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Medium,
                                color = Emerald200
                            )
                        }
                    }

                    // Row 2: Greeting & Next Prayer Focal Anchor
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        Column {
                            Text(
                                text = "Assalamu Alaikum, ${currentRole.greetingName}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                                color = Emerald100.copy(alpha = 0.85f)
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${currentRole.shortLabel} Workspace",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                        Column(
                            horizontalAlignment = Alignment.End,
                            modifier = Modifier.clickable { onOpenIslamicSuite("waqt") }
                        ) {
                            Text(
                                text = "Next: ${nextPrayerInfo.nextPrayer.name} in ${nextPrayerInfo.formattedCountdown}",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium,
                                color = Emerald200
                            )
                            Text(
                                text = nextPrayerInfo.nextPrayer.time,
                                fontSize = 20.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }

                    // Row 3: 5-Prayer Compact Schedule Strip Synced to Location
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        prayers.forEach { p ->
                            val isNext = p.name == nextPrayerInfo.nextPrayer.name
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (isNext) Color.White.copy(alpha = 0.20f) else Color.Black.copy(alpha = 0.16f),
                                border = BorderStroke(
                                    width = 1.dp,
                                    color = if (isNext) Color.White.copy(alpha = 0.45f) else Color.White.copy(alpha = 0.12f)
                                ),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { onOpenIslamicSuite("waqt") }
                            ) {
                                Column(
                                    modifier = Modifier.padding(vertical = 7.dp, horizontal = 4.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(
                                        text = p.name,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = Emerald100
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = p.time,
                                        fontSize = 12.sp,
                                        fontFamily = FontFamily.Monospace,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    }

                    // Row 4: MRM Sehri / Iftar & Prohibited Waqt Bar
                    HorizontalDivider(thickness = 1.dp, color = Color.White.copy(alpha = 0.15f))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Sehri ${almanac.sehriEnds} · Iftar ${almanac.iftarStarts}",
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            color = Emerald50,
                            modifier = Modifier.clickable { onOpenIslamicSuite("waqt") }
                        )
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color.White.copy(alpha = 0.16f),
                            modifier = Modifier.clickable { onOpenIslamicSuite("waqt") }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.WarningAmber,
                                    contentDescription = null,
                                    tint = Gold300,
                                    modifier = Modifier.size(12.dp)
                                )
                                Text(
                                    text = "Waqt & Haram Times",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color.White
                                )
                            }
                        }
                    }
                }
            }
        }

        // =========================================================================
        // 2. MRM COMPLETE ISLAMIC UTILITIES BENTO DOCK (8 MODULES — 4x2 GRID)
        // =========================================================================
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = null,
                            tint = Emerald600,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = "Daily Islamic Utilities · ${locationSnap.zone.code}",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = textPrimary
                        )
                    }
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.clickable { onOpenIslamicSuite("waqt") }
                    ) {
                        Text(
                            text = "All 9 Tools",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Emerald600
                        )
                        Icon(
                            imageVector = Icons.Default.ChevronRight,
                            contentDescription = null,
                            tint = Emerald600,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }

                // Row 1 of 4x2 Bento Grid
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    BentoUtilityCard(
                        label = "Waqt & Fast",
                        sub = "Sehri ${almanac.sehriEnds}",
                        icon = Icons.Default.Schedule,
                        iconBg = Emerald50,
                        iconTint = Emerald700,
                        iconBorder = Emerald200,
                        modifier = Modifier.weight(1f),
                        onClick = { onOpenIslamicSuite("waqt") }
                    )
                    BentoUtilityCard(
                        label = "Salah Log",
                        sub = "5 Waqt · Qaza",
                        icon = Icons.Default.CheckCircleOutline,
                        iconBg = Emerald50,
                        iconTint = Emerald700,
                        iconBorder = Emerald200,
                        modifier = Modifier.weight(1f),
                        onClick = { onOpenIslamicSuite("tracker") }
                    )
                    BentoUtilityCard(
                        label = "Qibla 3D",
                        sub = "${locationSnap.qiblaBearing}° WNW",
                        icon = Icons.Default.Explore,
                        iconBg = Amber50,
                        iconTint = Amber700,
                        iconBorder = Amber200,
                        modifier = Modifier.weight(1f),
                        onClick = { onOpenIslamicSuite("qibla") }
                    )
                    BentoUtilityCard(
                        label = "Tajweed",
                        sub = "Audio Quran",
                        icon = Icons.Default.MenuBook,
                        iconBg = Sky50,
                        iconTint = Sky700,
                        iconBorder = Sky200,
                        modifier = Modifier.weight(1f),
                        onClick = { onOpenIslamicSuite("quran") }
                    )
                }

                // Row 2 of 4x2 Bento Grid
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    BentoUtilityCard(
                        label = "Tasbih",
                        sub = "33x / 100x",
                        icon = Icons.Default.Tag,
                        iconBg = Emerald50,
                        iconTint = Emerald700,
                        iconBorder = Emerald200,
                        modifier = Modifier.weight(1f),
                        onClick = { onOpenIslamicSuite("tasbih") }
                    )
                    BentoUtilityCard(
                        label = "Duas",
                        sub = "Adhkar · Ruqyah",
                        icon = Icons.Default.AutoAwesome,
                        iconBg = Indigo50,
                        iconTint = Indigo700,
                        iconBorder = Indigo200,
                        modifier = Modifier.weight(1f),
                        onClick = { onOpenIslamicSuite("duas") }
                    )
                    BentoUtilityCard(
                        label = "Revert Salah",
                        sub = "7 Postures",
                        icon = Icons.Default.WbSunny,
                        iconBg = Amber50,
                        iconTint = Amber700,
                        iconBorder = Amber200,
                        modifier = Modifier.weight(1f),
                        onClick = { onOpenIslamicSuite("salah_guide") }
                    )
                    BentoUtilityCard(
                        label = "Halal & Fitrah",
                        sub = "E-Codes · Fidyah",
                        icon = Icons.Default.Calculate,
                        iconBg = Rose50,
                        iconTint = Rose700,
                        iconBorder = Rose200,
                        modifier = Modifier.weight(1f),
                        onClick = { onOpenIslamicSuite("halal") }
                    )
                }
            }
        }

        // =========================================================================
        // 3. MRM CARE & COMMUNITY QUICK ACTIONS (4-COLUMN ROW)
        // =========================================================================
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                BentoUtilityCard(
                    label = "Revert Care",
                    sub = "Kit & Mentor",
                    icon = Icons.Default.MenuBook,
                    iconBg = Emerald50,
                    iconTint = Emerald700,
                    iconBorder = Emerald200,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(ScreenId.DETAIL) }
                )
                BentoUtilityCard(
                    label = "Halal Aid",
                    sub = "Asnaf Box",
                    icon = Icons.Default.VolunteerActivism,
                    iconBg = Amber50,
                    iconTint = Amber700,
                    iconBorder = Amber200,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(ScreenId.CATALOG) }
                )
                BentoUtilityCard(
                    label = "Schedule",
                    sub = "Halaqa & Duty",
                    icon = Icons.Default.CalendarToday,
                    iconBg = Sky50,
                    iconTint = Sky700,
                    iconBorder = Sky200,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(ScreenId.CALENDAR) }
                )
                BentoUtilityCard(
                    label = "Care Chat",
                    sub = "24/7 Support",
                    icon = Icons.Default.ChatBubbleOutline,
                    iconBg = Teal50,
                    iconTint = Teal700,
                    iconBorder = Teal200,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(ScreenId.CHAT_DETAIL) }
                )
            }
        }

        // =========================================================================
        // 4. ROLE-ADAPTIVE PRIMARY OPERATIONS & CARE WORKSPACE
        // =========================================================================
        item {
            when (currentRole) {
                UserRolePersona.STAFF_ADMIN -> {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        // 2x2 KPI Untitled UI Metric Grid
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            KpiMetricCard(
                                label = "Active Field Units",
                                value = "18 Squads",
                                valueColor = textPrimary,
                                sub = "${locationSnap.zone.city} · +2 on duty",
                                subColor = Emerald600,
                                modifier = Modifier.weight(1f)
                            )
                            KpiMetricCard(
                                label = "Audited Zakat Pool",
                                value = "RM 184.5K",
                                valueColor = Emerald600,
                                sub = "LHDN Sec 44(6) verified",
                                subColor = Slate400,
                                modifier = Modifier.weight(1f)
                            )
                        }
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            KpiMetricCard(
                                label = "Median Response SLA",
                                value = "14.2 min",
                                valueColor = textPrimary,
                                sub = "Within 15m national target",
                                subColor = Emerald600,
                                modifier = Modifier.weight(1f)
                            )
                            KpiMetricCard(
                                label = "Volunteer Vetting",
                                value = "12 Pending",
                                valueColor = Amber600,
                                sub = "3 SKP clearances ready",
                                subColor = Slate400,
                                modifier = Modifier.weight(1f)
                            )
                        }

                        // Priority Relief Dispatches
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Priority Relief Dispatches",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = textPrimary
                            )
                            Text(
                                text = "Full Analytics",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Emerald600,
                                modifier = Modifier.clickable { onNavigate(ScreenId.STATS) }
                            )
                        }

                        // Ticket 1: SOS-8492
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(52.dp)
                                        .background(Amber50, RoundedCornerShape(12.dp))
                                        .border(1.dp, Amber200, RoundedCornerShape(12.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Inventory2,
                                        contentDescription = null,
                                        tint = Amber700,
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "Urgent Triage · SOS-8492 · ${locationSnap.zone.city} (${locationSnap.nearbyFacilities.firstOrNull()?.distanceKm ?: 1.2} km)",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Crimson600
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "Infant Formula & Emergency Halal Grocery Box",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = textPrimary
                                    )
                                    Text(
                                        text = "Single mother with 3 infants near ${locationSnap.zone.hubName}; pantry stocks depleted.",
                                        fontSize = 11.sp,
                                        color = textSecondary,
                                        modifier = Modifier.padding(top = 2.dp)
                                    )
                                    Spacer(modifier = Modifier.height(10.dp))
                                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        val isAssigned = assignedSquadIds.contains("SOS-8492")
                                        Button(
                                            onClick = {
                                                assignedSquadIds = assignedSquadIds + "SOS-8492"
                                                onShowToast("Assigned Responder Ahmad Faisal (#VOL-4190) to ${locationSnap.zone.city} · ETA 12 mins")
                                            },
                                            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                            shape = RoundedCornerShape(10.dp),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                            modifier = Modifier.height(36.dp)
                                        ) {
                                            Text(
                                                text = if (isAssigned) "Squad Dispatched ✓" else "Assign Nearest Squad",
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color.White
                                            )
                                        }
                                        OutlinedButton(
                                            onClick = { onNavigate(ScreenId.CHAT_DETAIL) },
                                            shape = RoundedCornerShape(10.dp),
                                            border = BorderStroke(1.dp, borderColor),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                            modifier = Modifier.height(36.dp)
                                        ) {
                                            Text(
                                                text = "Open Case Chat",
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = textPrimary
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        // Ticket 2: SAFE-104
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(52.dp)
                                        .background(Emerald50, RoundedCornerShape(12.dp))
                                        .border(1.dp, Emerald200, RoundedCornerShape(12.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.VerifiedUser,
                                        contentDescription = null,
                                        tint = Emerald700,
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "Safeguarding · SAFE-104 · ${locationSnap.zone.code} Sector",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Amber600
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "Revert Sister Safe Shelter & Mentor Escort",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = textPrimary
                                    )
                                    Text(
                                        text = "New convert requires verified female caseworker escort to transit home.",
                                        fontSize = 11.sp,
                                        color = textSecondary,
                                        modifier = Modifier.padding(top = 2.dp)
                                    )
                                    Spacer(modifier = Modifier.height(10.dp))
                                    val isSafeAssigned = assignedSquadIds.contains("SAFE-104")
                                    Button(
                                        onClick = {
                                            assignedSquadIds = assignedSquadIds + "SAFE-104"
                                            onShowToast("Deployed Ustazah Hana & Female Protection Escort")
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                        shape = RoundedCornerShape(10.dp),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                        modifier = Modifier.height(36.dp)
                                    ) {
                                        Text(
                                            text = if (isSafeAssigned) "Escort Deployed ✓" else "Deploy Female Escort",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                UserRolePersona.VOLUNTEER -> {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = if (isOnDuty) "On Duty · Dispatch Ready" else "Off Duty · Standby Mode",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = textPrimary
                                    )
                                    Text(
                                        text = "Squad ${locationSnap.zone.code} #VOL-4190 · GPS Verified",
                                        fontSize = 11.sp,
                                        fontFamily = FontFamily.Monospace,
                                        color = textSecondary
                                    )
                                }
                                Button(
                                    onClick = {
                                        isOnDuty = !isOnDuty
                                        onShowToast(if (isOnDuty) "Active on ${locationSnap.zone.city} Dispatch Grid" else "Switched to Standby Mode")
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text(if (isOnDuty) "Pause Duty" else "Go On Duty", fontSize = 11.sp, color = Color.White)
                                }
                            }
                        }
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(
                                    text = "ACTIVE CALLOUT · 1.4 KM · ETA 8 MINS",
                                    fontSize = 10.sp,
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald600
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "SOS-918: Emergency Halal Groceries & Elder Check-In",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = textPrimary
                                )
                                Text(
                                    text = "Beneficiary: Sister Amina (78yo). Near ${locationSnap.zone.hubName}, ${locationSnap.zone.city}.",
                                    fontSize = 12.sp,
                                    color = textSecondary,
                                    modifier = Modifier.padding(vertical = 4.dp)
                                )
                                Button(
                                    onClick = {
                                        missionAccepted = true
                                        onShowToast("Turn-by-turn route locked to ${locationSnap.zone.hubName}")
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = if (missionAccepted) "Navigating to Beneficiary ✓" else "Accept & Navigate",
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    }
                }

                UserRolePersona.SEEKER -> {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = surfaceColor,
                        border = BorderStroke(1.dp, borderColor),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(
                                text = "CONFIDENTIAL CARE · #REC-7721",
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = Emerald600
                            )
                            Text(
                                text = "Welcome Home to the MRM Brotherhood",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = textPrimary
                            )
                            Text(
                                text = "Every new Muslim receives a complimentary Bilingual Quran & Prayer Starter Kit, 1-on-1 mentor guidance, and confidential welfare support.",
                                fontSize = 12.sp,
                                color = textSecondary
                            )
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = { onNavigate(ScreenId.CHAT_DETAIL) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("24/7 Care Line", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                }
                                OutlinedButton(
                                    onClick = { onNavigate(ScreenId.DETAIL) },
                                    shape = RoundedCornerShape(10.dp),
                                    border = BorderStroke(1.dp, borderColor),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Claim Free Kit", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                                }
                            }
                        }
                    }
                }

                UserRolePersona.TEACHER -> {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = surfaceColor,
                        border = BorderStroke(1.dp, borderColor),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("TAULIAH CERTIFIED · #TCH-204", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                            Text("Today's Revert Mentoring Roster", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                            Text("15:00 • Sister Sarah Wong — Week 3: Wudhu & Daily Salah Postures", fontSize = 12.sp, color = textSecondary)
                            Text("17:30 • Brother David Tan — Harmonious Non-Muslim Family Ties", fontSize = 12.sp, color = textSecondary)
                        }
                    }
                }

                UserRolePersona.APPLICANT -> {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = surfaceColor,
                        border = BorderStroke(1.dp, borderColor),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Text("Volunteer Accreditation Progress", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                            Text(
                                text = if (skpUploaded) "Stage 3 of 4: Safeguarding Ethics (75%)" else "Stage 2 of 4: Police Clearance (50%)",
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                color = Amber600
                            )
                            LinearProgressIndicator(
                                progress = { if (skpUploaded) 0.75f else 0.50f },
                                color = Emerald600,
                                trackColor = Slate200,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(CircleShape)
                            )
                            Button(
                                onClick = {
                                    skpUploaded = true
                                    onShowToast("SKP Clearance uploaded and verified by MRM Registry")
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = if (skpUploaded) "SKP Document Submitted ✓" else "Submit Police Clearance (SKP)",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        }
                    }
                }

                UserRolePersona.MEMBER -> {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = surfaceColor,
                        border = BorderStroke(1.dp, borderColor),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("LHDN SEC 44(6) TAX DEDUCTIBLE", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                            Text("Sponsor a New Revert (Muallaf) Starter Kit • RM 85", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                            Text(
                                text = "Includes Hardcover Bilingual Quran, prayer mat, pictorial Salah guide, and 6 months 1-on-1 mentor pairing.",
                                fontSize = 12.sp,
                                color = textSecondary
                            )
                            LinearProgressIndicator(
                                progress = { 0.88f },
                                color = Emerald600,
                                trackColor = Slate200,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(CircleShape)
                            )
                            Button(
                                onClick = { onNavigate(ScreenId.DETAIL) },
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Sponsor 1 Kit (RM 85)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }
                    }
                }
            }
        }

        // =========================================================================
        // 5. ACTIVE WELFARE & REVERT PROGRAMS (2-COLUMN CARDS)
        // =========================================================================
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Active Welfare & Revert Programs",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = textPrimary
                    )
                    Text(
                        text = "See All >",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Emerald600,
                        modifier = Modifier.clickable { onNavigate(ScreenId.CATALOG) }
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MrmSampleData.CATALOG_ITEMS.take(2).forEach { camp ->
                        val progress = MrmLogic.calculateCampaignProgress(camp.raised, camp.goal)
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onSelectCatalogItem(camp) }
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(
                                    text = "${camp.category} · ${progress.percentage}% Funded",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Emerald600,
                                    maxLines = 1
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = camp.title,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = textPrimary,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = camp.subtitle,
                                    fontSize = 10.sp,
                                    color = textSecondary,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                HorizontalDivider(thickness = 1.dp, color = borderColor)
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "RM ${camp.price} / Free",
                                        fontSize = 11.sp,
                                        fontFamily = FontFamily.Monospace,
                                        fontWeight = FontWeight.Bold,
                                        color = Emerald600
                                    )
                                    Icon(
                                        imageVector = Icons.Default.ArrowForward,
                                        contentDescription = null,
                                        tint = Slate400,
                                        modifier = Modifier.size(14.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun BentoUtilityCard(
    label: String,
    sub: String,
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    iconBorder: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        modifier = modifier
            .defaultMinSize(minHeight = 76.dp)
            .clickable(onClick = onClick)
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .background(iconBg, RoundedCornerShape(11.dp))
                    .border(1.dp, iconBorder, RoundedCornerShape(11.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = label,
                    tint = iconTint,
                    modifier = Modifier.size(16.dp)
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = sub,
                fontSize = 8.5.sp,
                color = Slate400,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
private fun KpiMetricCard(
    label: String,
    value: String,
    valueColor: Color,
    sub: String,
    subColor: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(
                text = label,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = Slate400
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                fontSize = 18.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold,
                color = valueColor
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = sub,
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
                color = subColor,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
private fun IslamicUtilitiesBottomSheetContent(
    activeTab: String,
    onSelectTab: (String) -> Unit,
    locationSnap: LocationSyncSnapshot,
    onSelectZone: (String) -> Unit,
    onSyncGps: () -> Unit,
    onClose: () -> Unit
) {
    val tabs = listOf(
        "waqt" to "Waqt & Fasting",
        "tracker" to "Salah Tracker",
        "qibla" to "Qibla 3D",
        "quran" to "Tajweed Quran",
        "tasbih" to "Tasbih",
        "duas" to "Duas & Ruqyah",
        "salah_guide" to "Revert Salah",
        "names" to "99 Names",
        "halal" to "Halal & Fitrah"
    )
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(max = 640.dp)
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        // Header matching Web IslamicUtilitiesSheet
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .background(Emerald600, RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
                Column {
                    Text(
                        text = "MRM Islamic Utilities & Almanac Suite",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = textPrimary
                    )
                    Text(
                        text = "JAKIM / Global Zone Synced • ${locationSnap.zone.city} (${locationSnap.zone.code})",
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.SemiBold,
                        color = Emerald600
                    )
                }
            }
            HeaderIconButton(
                icon = Icons.Default.Close,
                contentDescription = "Close Islamic Utilities Suite",
                tint = textPrimary,
                onClick = onClose
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Zone Selector Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            MrmSampleData.LOCATION_ZONES.forEach { z ->
                FilterChip(
                    selected = z.code == locationSnap.zone.code,
                    onClick = { onSelectZone(z.code) },
                    label = { Text("${z.city} · ${z.code}", fontSize = 11.sp) }
                )
            }
        }

        // 9-Module Horizontal Tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            tabs.forEach { (id, label) ->
                val selected = activeTab == id
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = if (selected) Emerald600 else surfaceColor,
                    border = BorderStroke(1.dp, if (selected) Emerald600 else borderColor),
                    modifier = Modifier.clickable { onSelectTab(id) }
                ) {
                    Text(
                        text = label,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (selected) Color.White else textPrimary,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp)
                    )
                }
            }
        }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f, fill = false)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            when (activeTab) {
                "waqt" -> {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(Brush.linearGradient(listOf(Emerald800, Emerald700, Emerald900)))
                            .padding(14.dp)
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(
                                text = "Sehri & Iftar Almanac • ${locationSnap.zone.city} (${locationSnap.zone.code})",
                                color = Emerald100,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text("Sehri Last Time (Imsak)", color = Emerald200, fontSize = 10.sp)
                                    Text("${locationSnap.almanac.sehriEnds} AM", color = Color.White, fontSize = 16.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                }
                                Column {
                                    Text("Sunrise (Syuruk)", color = Emerald200, fontSize = 10.sp)
                                    Text("${locationSnap.almanac.sunriseTime} AM", color = Gold300, fontSize = 16.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                }
                                Column {
                                    Text("Today's Iftar (Maghrib)", color = Gold200, fontSize = 10.sp)
                                    Text("${locationSnap.almanac.iftarStarts} PM", color = Color.White, fontSize = 16.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    locationSnap.almanac.periods.forEach { period ->
                        val bgColor = when (period.category) {
                            "PROHIBITED" -> Rose50
                            "NAFL" -> Amber50
                            else -> surfaceColor
                        }
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = bgColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(period.name, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate900)
                                    Text("${period.startTime} - ${period.endTime}", fontFamily = FontFamily.Monospace, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald700)
                                }
                                Text("${period.category} • ${period.ruling}", fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = if (period.category == "PROHIBITED") Crimson600 else Emerald600)
                                Text(period.description, fontSize = 11.sp, color = Slate600)
                            }
                        }
                    }
                }

                "tracker" -> {
                    var subuhDone by remember { mutableStateOf(true) }
                    var zohorDone by remember { mutableStateOf(true) }
                    var asarDone by remember { mutableStateOf(true) }
                    var maghribDone by remember { mutableStateOf(false) }
                    var isyakDone by remember { mutableStateOf(false) }
                    var qazaDebt by remember { mutableIntStateOf(4) }

                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = surfaceColor,
                        border = BorderStroke(1.dp, borderColor),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("5-Waqt Farz Salah & Qaza Debt Log", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                            listOf(
                                Triple("Subuh", subuhDone) { subuhDone = !subuhDone },
                                Triple("Zohor", zohorDone) { zohorDone = !zohorDone },
                                Triple("Asar", asarDone) { asarDone = !asarDone },
                                Triple("Maghrib", maghribDone) { maghribDone = !maghribDone },
                                Triple("Isyak", isyakDone) { isyakDone = !isyakDone }
                            ).forEach { (name, done, toggle) ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(10.dp))
                                        .clickable(onClick = toggle)
                                        .padding(vertical = 6.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(name, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = textPrimary)
                                    Checkbox(checked = done, onCheckedChange = { toggle() })
                                }
                            }
                            HorizontalDivider(color = borderColor)
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Qaza Missed Prayers Remaining: $qazaDebt", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                                Button(
                                    onClick = { if (qazaDebt > 0) qazaDebt-- },
                                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                                ) {
                                    Text("-1 Qaza Prayed", fontSize = 11.sp, color = Color.White)
                                }
                            }
                        }
                    }
                }

                "qibla" -> {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Emerald900,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier.padding(18.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("3D SPHERICAL QIBLA COMPASS", color = Gold300, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(10.dp))
                            // Canvas Qibla Compass Dial
                            Canvas(modifier = Modifier.size(120.dp)) {
                                val radius = size.minDimension / 2f
                                drawCircle(
                                    color = Color.White.copy(alpha = 0.2f),
                                    radius = radius,
                                    style = Stroke(width = 6f)
                                )
                                val angleRad = Math.toRadians(locationSnap.qiblaBearing - 90.0)
                                val endX = center.x + (radius * 0.75f * cos(angleRad)).toFloat()
                                val endY = center.y + (radius * 0.75f * sin(angleRad)).toFloat()
                                drawLine(
                                    color = Gold400,
                                    start = center,
                                    end = Offset(endX, endY),
                                    strokeWidth = 8f,
                                    cap = StrokeCap.Round
                                )
                                drawCircle(color = Emerald400, radius = 10f, center = center)
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("${locationSnap.qiblaBearing}° WNW", color = Color.White, fontSize = 26.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.ExtraBold)
                            Text(
                                "${locationSnap.zone.city} (${String.format(Locale.US, "%.4f", locationSnap.latitude)}°N, ${String.format(Locale.US, "%.4f", locationSnap.longitude)}°E) • ${locationSnap.distanceToKaabaKm} km to Makkah",
                                color = Emerald100,
                                fontSize = 11.sp,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                    Text("Nearby MRM Hubs & Mosques", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                    locationSnap.nearbyFacilities.take(5).forEach { fac ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(fac.name, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = textPrimary)
                                    Text("${fac.city} • ${fac.status}", fontSize = 10.sp, color = textSecondary)
                                }
                                Text("${fac.distanceKm} km", fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Emerald600)
                            }
                        }
                    }
                }

                "quran" -> {
                    MrmSampleData.SURAHS.forEach { surah ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("${surah.number}. ${surah.nameTranslit} (${surah.meaning})", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                                    Text(surah.nameArabic, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                                }
                                Spacer(Modifier.height(4.dp))
                                Text(surah.keyAyahArabic, fontSize = 16.sp, color = textPrimary)
                                Text(surah.keyAyahTranslation, fontSize = 11.sp, color = textSecondary)
                            }
                        }
                    }
                }

                "tasbih" -> {
                    var count by remember { mutableIntStateOf(18) }
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Emerald900,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", color = Gold300, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                            Text("SubhanAllahi wa bihamdihi", color = Emerald100, fontSize = 12.sp)
                            Spacer(Modifier.height(12.dp))
                            Text("$count / 33", color = Color.White, fontSize = 36.sp, fontWeight = FontWeight.ExtraBold, fontFamily = FontFamily.Monospace)
                            Spacer(Modifier.height(12.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                Button(
                                    onClick = { count = (count + 1) % 34 },
                                    colors = ButtonDefaults.buttonColors(containerColor = Gold500, contentColor = Slate900)
                                ) {
                                    Text("+1 Count Dhikr", fontWeight = FontWeight.Bold)
                                }
                                OutlinedButton(onClick = { count = 0 }) {
                                    Text("Reset", color = Color.White)
                                }
                            }
                        }
                    }
                }

                "duas" -> {
                    MrmSampleData.MASNOON_DUAS.forEach { dua ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text("${dua.title} (${dua.category})", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Emerald600)
                                Spacer(Modifier.height(4.dp))
                                Text(dua.arabic, fontSize = 15.sp, color = textPrimary)
                                Text(dua.transliteration, fontSize = 11.sp, fontWeight = FontWeight.Medium, color = Emerald700)
                                Text(dua.translation, fontSize = 11.sp, color = textSecondary)
                                Text(dua.reference, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate400)
                            }
                        }
                    }
                }

                "salah_guide" -> {
                    MrmSampleData.REVERT_SALAH_STEPS.forEach { step ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text("Posture ${step.stepNumber}/7 • ${step.postureName}", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Emerald600)
                                Text(step.arabicPhrase, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                                Text(step.transliteration, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Amber700)
                                Text("\"${step.englishMeaning}\"", fontSize = 11.sp, color = textPrimary)
                                Text(step.guidanceNote, fontSize = 10.sp, color = textSecondary)
                            }
                        }
                    }
                }

                "names" -> {
                    MrmSampleData.ASMA_UL_HUSNA.forEach { item ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text("${item.number}. ${item.transliteration} — ${item.meaning}", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                                    Text(item.reflection, fontSize = 11.sp, color = textSecondary)
                                }
                                Text(item.arabic, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                            }
                        }
                    }
                }

                else -> {
                    // Halal E-Codes & Fitrah/Fidyah Calculator
                    var dependents by remember { mutableIntStateOf(3) }
                    var missedDays by remember { mutableIntStateOf(2) }
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = surfaceColor,
                        border = BorderStroke(1.dp, borderColor),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text("Zakat Fitrah & Fidyah Calculator (JAKIM 2026)", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                            Text("Household Dependents: $dependents pax × RM 14 = RM ${dependents * 14}", fontSize = 12.sp, color = textSecondary)
                            Text("Fidyah Missed Fasts: $missedDays days × RM 4 = RM ${missedDays * 4}", fontSize = 12.sp, color = textSecondary)
                            Text("Total Payable: RM ${(dependents * 14) + (missedDays * 4)}", fontSize = 15.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.ExtraBold, color = Emerald600)
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                OutlinedButton(onClick = { dependents++ }) { Text("+1 Dependent", fontSize = 11.sp) }
                                OutlinedButton(onClick = { missedDays++ }) { Text("+1 Fidyah Day", fontSize = 11.sp) }
                            }
                        }
                    }
                    MrmSampleData.HALAL_ECODES.forEach { ecode ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = surfaceColor,
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("${ecode.code} • ${ecode.name}", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = textPrimary)
                                    Text(
                                        text = ecode.status.uppercase(Locale.US),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = when (ecode.status) {
                                            "Haram" -> Crimson600
                                            "Mushbooh" -> Amber600
                                            else -> Emerald600
                                        }
                                    )
                                }
                                Text("Source: ${ecode.source}", fontSize = 11.sp, color = textSecondary)
                                Text(ecode.jakimNote, fontSize = 10.sp, color = Emerald600)
                            }
                        }
                    }
                }
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

@Composable
private fun SplashScreenView(onContinue: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Emerald950)
            .padding(28.dp),
        verticalArrangement = Arrangement.SpaceBetween,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(24.dp))
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            MrmLogoBadge(width = 84.dp, height = 58.dp)
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                text = "MULTIRACIAL REVERTED MUSLIMS",
                fontSize = 11.sp,
                letterSpacing = 2.sp,
                color = Gold400,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "MRM Care",
                fontSize = 34.sp,
                color = Color.White,
                fontWeight = FontWeight.ExtraBold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Official Revert Support, Location-Synced Islamic Companion & Audited Zakat Hub",
                fontSize = 13.sp,
                color = Emerald100,
                textAlign = TextAlign.Center
            )
        }
        Button(
            onClick = onContinue,
            colors = ButtonDefaults.buttonColors(containerColor = Emerald600, contentColor = Color.White),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        ) {
            Text("Enter MRM Care", fontWeight = FontWeight.Bold, fontSize = 15.sp)
        }
    }
}

@Composable
private fun OnboardingScreenView(onContinue: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            Text(
                text = "SHARIAH-AUDITED REVERT & WELFARE HUB",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = Emerald600
            )
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "Every New Muslim & Asnaf Family Supported with Dignity.",
                fontSize = 24.sp,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onSurface,
                lineHeight = 30.sp
            )
            Spacer(modifier = Modifier.height(16.dp))
            val pillars = listOf(
                "24/7 Confidential Revert Care, Safe Haven & 1-on-1 Mentorship",
                "Location-Synced JAKIM Prayer Times, Waqt Almanac & 3D Qibla",
                "100% LHDN Sec 44(6) Tax-Exempt Zakat & Asnaf Relief Dispatches"
            )
            pillars.forEach { point ->
                Row(
                    modifier = Modifier.padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Verified, contentDescription = null, tint = Emerald600)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(point, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, fontWeight = FontWeight.Medium)
                }
            }
        }
        Button(
            onClick = onContinue,
            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text("Continue", fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}

@Composable
private fun WelcomeScreenView(
    onSignIn: () -> Unit,
    onSignUp: () -> Unit,
    onSkipHome: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.SpaceBetween,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            MrmLogoBadge(width = 72.dp, height = 50.dp)
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Welcome to MRM Care",
                fontSize = 24.sp,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "Multiracial Reverted Muslims • Faith, Welfare & Relief",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
        }
        Column(verticalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
            Button(
                onClick = onSignIn,
                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(48.dp)
            ) {
                Text("Sign In to Member Account", fontWeight = FontWeight.Bold, color = Color.White)
            }
            OutlinedButton(
                onClick = onSignUp,
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(48.dp)
            ) {
                Text("Create New Account", fontWeight = FontWeight.Bold)
            }
            TextButton(onClick = onSkipHome, modifier = Modifier.fillMaxWidth()) {
                Text("Continue Directly to Home Hub", color = Emerald600, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun LoginScreenView(onLoginSuccess: () -> Unit, onRegister: () -> Unit) {
    var email by remember { mutableStateOf("capt.zulkifli@mrm.org.my") }
    var password by remember { mutableStateOf("••••••••••••") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Text("Assalamu Alaikum", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onSurface)
        Text("Sign in to your MRM Care workspace.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email or MyKad ID") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        Button(
            onClick = onLoginSuccess,
            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().height(50.dp)
        ) {
            Text("Sign In Securely", fontWeight = FontWeight.Bold, color = Color.White)
        }
        TextButton(onClick = onRegister, modifier = Modifier.align(Alignment.CenterHorizontally)) {
            Text("New to MRM Care? Register Member Account", color = Emerald600)
        }
    }
}

@Composable
private fun RegisterScreenView(onVerify: () -> Unit, onBackToLogin: () -> Unit) {
    var fullName by remember { mutableStateOf("Adam Lim bin Abdullah") }
    var phone by remember { mutableStateOf("+60 12-345 6789") }
    var stateZone by remember { mutableStateOf("WLY01 • Kuala Lumpur") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Create MRM Care Identity", fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onSurface)
        Text("Registered members receive automated LHDN tax-exempt receipts and mentor support.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

        OutlinedTextField(value = fullName, onValueChange = { fullName = it }, label = { Text("Full Name (As per MyKad)") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Mobile Number") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = stateZone, onValueChange = { stateZone = it }, label = { Text("Default JAKIM Prayer Zone") }, modifier = Modifier.fillMaxWidth())

        Button(
            onClick = onVerify,
            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().height(50.dp)
        ) {
            Text("Complete Registration", fontWeight = FontWeight.Bold, color = Color.White)
        }
        TextButton(onClick = onBackToLogin) {
            Text("Already registered? Back to Sign In", color = Emerald600)
        }
    }
}

@Composable
private fun MenuDrawerScreenView(
    currentRole: UserRolePersona,
    locationSnap: LocationSyncSnapshot,
    isDarkTheme: Boolean,
    onToggleTheme: () -> Unit,
    onNavigate: (ScreenId) -> Unit,
    onOpenIslamicSuite: (String) -> Unit,
    onOpenScreenDirectory: () -> Unit
) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Brand Identity Card matching Web MenuNavigationScreen
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = surfaceColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    MrmLogoBadge(width = 48.dp, height = 34.dp)
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("Multiracial Reverted Muslims", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                            Icon(Icons.Default.Verified, contentDescription = null, tint = Emerald600, modifier = Modifier.size(14.dp))
                        }
                        Text("Official Revert Care, Islamic Utilities & Zakat Hub", fontSize = 11.sp, color = textSecondary)
                        Text("Active Role: ${currentRole.shortLabel} (${currentRole.fullName})", fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = Emerald600)
                    }
                }
            }
        }

        // Appearance Theme Switcher Card (Light / Dark)
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = surfaceColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Appearance & Theme", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                        Text("Switch between Daylight and OLED Night mode", fontSize = 11.sp, color = textSecondary)
                    }
                    Button(
                        onClick = onToggleTheme,
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(if (isDarkTheme) "Dark Mode" else "Light Mode", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
            }
        }

        // MRM Islamic Utilities Shortcuts
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Emerald800,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("MRM ISLAMIC UTILITIES (9 MODULES • ${locationSnap.zone.code})", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Gold300)
                    Text("${locationSnap.zone.city} • Qibla ${locationSnap.qiblaBearing}° WNW", fontSize = 14.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                    Button(
                        onClick = { onOpenIslamicSuite("waqt") },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Emerald900),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Open All 9 Islamic Utilities", fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("20-Screen Mobile System", fontSize = 14.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
                TextButton(onClick = onOpenScreenDirectory) {
                    Text("Quick Modal", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                }
            }
        }

        items(ScreenId.entries) { screen ->
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = surfaceColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigate(screen) }
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(
                            text = String.format(Locale.US, "%02d", screen.ordinal + 1),
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.sp,
                            color = Slate400
                        )
                        Column {
                            Text(screen.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                            Text(screen.category, fontSize = 10.sp, color = textSecondary)
                        }
                    }
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Slate400)
                }
            }
        }
    }
}

@Composable
private fun SearchScreenView(
    locationSnap: LocationSyncSnapshot,
    onSelectItem: (CatalogItem) -> Unit,
    onOpenIslamicSuite: (String) -> Unit
) {
    var query by remember { mutableStateOf("") }
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    val filtered = remember(query) {
        if (query.isBlank()) MrmSampleData.CATALOG_ITEMS
        else MrmSampleData.CATALOG_ITEMS.filter {
            it.title.contains(query, ignoreCase = true) ||
                    it.category.contains(query, ignoreCase = true) ||
                    it.location.contains(query, ignoreCase = true)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Text(
            text = "Synced Zone: ${locationSnap.zone.city} (${locationSnap.zone.code}) • Qibla ${locationSnap.qiblaBearing}° WNW",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Emerald600
        )
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            label = { Text("Search mosques, Tajweed, Halal E-codes, kits...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            OutlinedButton(onClick = { onOpenIslamicSuite("quran") }, modifier = Modifier.weight(1f)) {
                Text("Tajweed Quran", fontSize = 10.sp)
            }
            OutlinedButton(onClick = { onOpenIslamicSuite("halal") }, modifier = Modifier.weight(1f)) {
                Text("E-Code Scanner", fontSize = 10.sp)
            }
        }
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(filtered) { item ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = surfaceColor,
                    border = BorderStroke(1.dp, borderColor),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelectItem(item) }
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(item.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                        Text("${item.category} • ${item.location}", fontSize = 11.sp, color = textSecondary)
                        Text("${item.auditCode} • RM ${item.price} / share", fontSize = 11.sp, color = Emerald600, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }
    }
}

@Composable
private fun CatalogScreenView(
    onSelectItem: (CatalogItem) -> Unit,
    onGoToCart: () -> Unit,
    cartCount: Int
) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Infaq & Relief Campaigns", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
                Text("LHDN Sec 44(6) Tax-Exempt Welfare Pool", fontSize = 11.sp, color = textSecondary)
            }
            Button(
                onClick = onGoToCart,
                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Basket ($cartCount)", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Color.White)
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(MrmSampleData.CATALOG_ITEMS) { item ->
                val progress = MrmLogic.calculateCampaignProgress(item.raised, item.goal)
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = surfaceColor,
                    border = BorderStroke(1.dp, borderColor),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelectItem(item) }
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(item.category, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                            Text(item.urgency, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Crimson600)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(item.title, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                        Text(item.subtitle, fontSize = 12.sp, color = textSecondary)
                        Spacer(modifier = Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = { progress.percentage / 100f },
                            color = Emerald600,
                            trackColor = Slate200,
                            modifier = Modifier.fillMaxWidth().height(6.dp).clip(CircleShape)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("RM ${item.raised} / RM ${item.goal} (${progress.percentage}%)", fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, color = textPrimary)
                            Text("RM ${item.price} / share", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DetailScreenView(
    item: CatalogItem,
    onAddToCart: () -> Unit
) {
    val progress = MrmLogic.calculateCampaignProgress(item.raised, item.goal)
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = surfaceColor,
            border = BorderStroke(1.dp, borderColor),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("${item.category} • ${item.auditCode}", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                Text(item.title, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
                Text(item.description, fontSize = 13.sp, color = textSecondary)
                LinearProgressIndicator(
                    progress = { progress.percentage / 100f },
                    color = Emerald600,
                    trackColor = Slate200,
                    modifier = Modifier.fillMaxWidth().height(8.dp).clip(CircleShape)
                )
                Text("Raised RM ${item.raised} of RM ${item.goal} (${progress.percentage}%) • ${item.donors} Donors", fontSize = 12.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, color = textPrimary)
                Button(
                    onClick = onAddToCart,
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().height(48.dp)
                ) {
                    Text("Pledge Share (RM ${item.price})", fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
        }
    }
}

@Composable
private fun CartScreenView(
    cartItems: List<CartItem>,
    summary: InfaqSummary,
    onUpdateQty: (String, Int) -> Unit,
    onCheckout: () -> Unit
) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Sadaqah & Infaq Basket", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(cartItems) { entry ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = surfaceColor,
                    border = BorderStroke(1.dp, borderColor),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(entry.item.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                            Text("RM ${entry.item.price} × ${entry.quantity} shares", fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = textSecondary)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(onClick = { onUpdateQty(entry.item.id, -1) }) {
                                Icon(Icons.Default.RemoveCircleOutline, contentDescription = "Decrease", tint = textPrimary)
                            }
                            Text("${entry.quantity}", fontWeight = FontWeight.Bold, color = textPrimary)
                            IconButton(onClick = { onUpdateQty(entry.item.id, 1) }) {
                                Icon(Icons.Default.AddCircleOutline, contentDescription = "Increase", tint = Emerald600)
                            }
                        }
                    }
                }
            }
        }
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = surfaceColor,
            border = BorderStroke(1.dp, borderColor),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Subtotal: RM ${summary.subtotal}", fontSize = 12.sp, color = textSecondary)
                Text("Field Volunteer Fuel Top-Up: RM ${summary.logisticsSupport}", fontSize = 12.sp, color = textSecondary)
                Text("Total Infaq: RM ${summary.totalAmount}", fontSize = 16.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.ExtraBold, color = Emerald600)
                Button(
                    onClick = onCheckout,
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().height(48.dp)
                ) {
                    Text("Proceed to FPX / DuitNow Checkout", fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
        }
    }
}

@Composable
private fun CheckoutScreenView(
    summary: InfaqSummary,
    onComplete: () -> Unit
) {
    var selectedBank by remember { mutableStateOf("Maybank2u Islamic FPX") }
    val banks = listOf("Maybank2u Islamic FPX", "Bank Islam FPX", "CIMB Octo Islamic", "DuitNow QR Instant")
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Zakat & Infaq Checkout", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
        Text("Total Payable: RM ${summary.totalAmount} (LHDN Sec 44(6) Tax Exempt)", fontSize = 13.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold, color = Emerald600)
        banks.forEach { bank ->
            val isSelected = bank == selectedBank
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = if (isSelected) Emerald50 else surfaceColor,
                border = BorderStroke(1.dp, if (isSelected) Emerald600 else borderColor),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { selectedBank = bank }
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(bank, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = if (isSelected) Emerald900 else textPrimary)
                    if (isSelected) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Emerald600)
                    }
                }
            }
        }
        Button(
            onClick = onComplete,
            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth().height(50.dp)
        ) {
            Text("Authorize RM ${summary.totalAmount} via $selectedBank", fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}

@Composable
private fun CalendarPrayerScreenView(
    locationSnap: LocationSyncSnapshot,
    onOpenZonePicker: () -> Unit,
    onOpenIslamicSuite: (String) -> Unit
) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = surfaceColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth().clickable(onClick = onOpenZonePicker)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("${locationSnap.zone.city} · ${locationSnap.zone.code}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                        Text("${locationSnap.almanac.hijriDate} • Sehri ${locationSnap.almanac.sehriEnds} · Iftar ${locationSnap.almanac.iftarStarts}", fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = Emerald600)
                    }
                    Text("Change Zone ▾", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                }
            }
        }
        item {
            Button(
                onClick = { onOpenIslamicSuite("waqt") },
                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Open Full Waqt & Prohibited Prayer Windows", fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
        items(locationSnap.almanac.periods) { p ->
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = surfaceColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(p.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                        Text("${p.startTime} - ${p.endTime}", fontFamily = FontFamily.Monospace, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                    }
                    Text("${p.category} • ${p.ruling}", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = if (p.category == "PROHIBITED") Crimson600 else Emerald600)
                    Text(p.description, fontSize = 11.sp, color = textSecondary)
                }
            }
        }
    }
}

@Composable
private fun NotificationsScreenView(onNavigate: (ScreenId) -> Unit) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text("Alerts & Dispatches", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
        Surface(
            shape = RoundedCornerShape(14.dp),
            color = surfaceColor,
            border = BorderStroke(1.dp, borderColor),
            modifier = Modifier.fillMaxWidth().clickable { onNavigate(ScreenId.HOME) }
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Text("SOS-8492 Urgent Triage • Kuala Lumpur", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Crimson600)
                Text("Single mother with 3 infants near Masjid Wilayah Persekutuan Hub requires emergency halal groceries.", fontSize = 12.sp, color = textSecondary)
            }
        }
    }
}

@Composable
private fun ChatListScreenView(onOpenChat: () -> Unit) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text("Community Feed & Caseworker Channels", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
        Surface(
            shape = RoundedCornerShape(14.dp),
            color = surfaceColor,
            border = BorderStroke(1.dp, borderColor),
            modifier = Modifier.fillMaxWidth().clickable(onClick = onOpenChat)
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Text("Brother Hisham Al-Faruq • Revert Care Mentor", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = textPrimary)
                Text("Assalamu Alaikum! Your Bilingual Tajweed Quran & Starter Kit is ready at Masjid Wilayah Hub.", fontSize = 12.sp, color = textSecondary)
                Spacer(modifier = Modifier.height(6.dp))
                Text("Tap to Open Direct Care Chat →", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
            }
        }
    }
}

@Composable
private fun ChatDetailScreenView() {
    var draft by remember { mutableStateOf("") }
    var messages by remember {
        mutableStateOf(
            listOf(
                "Brother Hisham: Assalamu Alaikum! How can our Revert Care & Relief team assist you today?",
                "You: Waalaikumsalam, I would like to schedule my weekly Salah & Tajweed mentoring session."
            )
        )
    }
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.SpaceBetween) {
        LazyColumn(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(messages) { msg ->
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = surfaceColor,
                    border = BorderStroke(1.dp, borderColor),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(msg, modifier = Modifier.padding(12.dp), fontSize = 12.sp, color = textPrimary)
                }
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = draft,
                onValueChange = { draft = it },
                placeholder = { Text("Message caseworker...") },
                modifier = Modifier.weight(1f),
                singleLine = true
            )
            Button(
                onClick = {
                    if (draft.isNotBlank()) {
                        messages = messages + "You: $draft"
                        draft = ""
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
            ) {
                Text("Send", color = Color.White)
            }
        }
    }
}

@Composable
private fun UploadReportScreenView(onSubmitted: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("System States & Field Proof Upload", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onSurface)
        Text("All 20 screens verified • Offline fallback and retry telemetry nominal.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Button(
            onClick = onSubmitted,
            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("View Live Impact Analytics", fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}

@Composable
private fun StatsLedgerScreenView(privacyMaskAmounts: Boolean) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Impact Analytics & Zakat Ledger", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = surfaceColor,
            border = BorderStroke(1.dp, borderColor),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Audited Zakat & Infaq Disbursed", fontSize = 12.sp, color = textSecondary)
                Text(
                    text = if (privacyMaskAmounts) "RM •••••••" else "RM 184,500",
                    fontSize = 24.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.ExtraBold,
                    color = Emerald600
                )
                Text("1,420 Asnaf Households & 318 New Reverts Supported", fontSize = 12.sp, color = textPrimary)
            }
        }
    }
}

@Composable
private fun ProfileScreenView(
    currentRole: UserRolePersona,
    onSwitchRole: () -> Unit,
    onOpenSettings: () -> Unit
) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = surfaceColor,
            border = BorderStroke(1.dp, borderColor),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(currentRole.fullName, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = textPrimary)
                Text("${currentRole.shortLabel} • ${currentRole.badgeTitle}", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Emerald600)
                Text("LHDN Sec 44(6) Verified Member & Officer Identity", fontSize = 11.sp, color = textSecondary)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = onSwitchRole,
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Switch Role", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }
                    OutlinedButton(
                        onClick = onOpenSettings,
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(1.dp, borderColor),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Settings & Zone", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                    }
                }
            }
        }
    }
}

@Composable
private fun SettingsScreenView(
    locationSnap: LocationSyncSnapshot,
    isDarkTheme: Boolean,
    onToggleTheme: () -> Unit,
    onSelectZone: (String) -> Unit,
    onSyncGps: () -> Unit,
    privacyMaskAmounts: Boolean,
    onTogglePrivacy: () -> Unit,
    onOpenDirectory: () -> Unit,
    onNavigate: (ScreenId) -> Unit
) {
    val surfaceColor = MaterialTheme.colorScheme.surface
    val borderColor = MaterialTheme.colorScheme.outline
    val textPrimary = MaterialTheme.colorScheme.onSurface
    val textSecondary = MaterialTheme.colorScheme.onSurfaceVariant

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = surfaceColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Application Theme", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                            Text("Default Daylight or OLED Dark mode", fontSize = 11.sp, color = textSecondary)
                        }
                        Switch(checked = isDarkTheme, onCheckedChange = { onToggleTheme() })
                    }
                    HorizontalDivider(color = borderColor)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("20-Screen Master Directory", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                            Text("Inspect all 20 production screens", fontSize = 11.sp, color = textSecondary)
                        }
                        Button(
                            onClick = onOpenDirectory,
                            colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("Open Directory", fontSize = 11.sp, color = Color.White)
                        }
                    }
                }
            }
        }

        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = surfaceColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Location & JAKIM Prayer Sync", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                            Text("Active: ${locationSnap.zone.city} (${locationSnap.zone.code}) • Qibla ${locationSnap.qiblaBearing}°", fontSize = 11.sp, color = Emerald600)
                        }
                        OutlinedButton(onClick = onSyncGps) {
                            Text("GPS Sync", fontSize = 11.sp)
                        }
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth().horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        MrmSampleData.LOCATION_ZONES.forEach { z ->
                            FilterChip(
                                selected = z.code == locationSnap.zone.code,
                                onClick = { onSelectZone(z.code) },
                                label = { Text("${z.city} · ${z.code}", fontSize = 11.sp) }
                            )
                        }
                    }
                }
            }
        }

        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = surfaceColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Discreet Donation Privacy Mask", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = textPrimary)
                        Text("Hide RM amounts on public screens", fontSize = 11.sp, color = textSecondary)
                    }
                    Switch(checked = privacyMaskAmounts, onCheckedChange = { onTogglePrivacy() })
                }
            }
        }
    }
}
