package my.org.mrm.care.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Primary Emerald Architectural Palette
val Emerald950 = Color(0xFF022C22)
val Emerald900 = Color(0xFF064E3B)
val Emerald800 = Color(0xFF065F46)
val Emerald700 = Color(0xFF047857)
val Emerald600 = Color(0xFF059669)
val Emerald500 = Color(0xFF10B981)
val Emerald400 = Color(0xFF34D399)
val Emerald300 = Color(0xFF6EE7B7)
val Emerald200 = Color(0xFFA7F3D0)
val Emerald100 = Color(0xFFD1FAE5)
val Emerald50 = Color(0xFFECFDF5)

// Gold & Amber Accents
val Gold500 = Color(0xFFF59E0B)
val Gold400 = Color(0xFFFBBF24)
val Gold300 = Color(0xFFFCD34D)
val Gold200 = Color(0xFFFDE68A)
val Gold100 = Color(0xFFFEF3C7)

// Pastel Bento Icon Tints (Exact Web UI Match)
val Amber700 = Color(0xFFB45309)
val Amber600 = Color(0xFFD97706)
val Amber200 = Color(0xFFFDE68A)
val Amber50 = Color(0xFFFFFBEB)

val Sky700 = Color(0xFF0369A1)
val Sky600 = Color(0xFF0284C7)
val Sky200 = Color(0xFFBAE6FD)
val Sky50 = Color(0xFFF0F9FF)

val Indigo700 = Color(0xFF4338CA)
val Indigo600 = Color(0xFF4F46E5)
val Indigo200 = Color(0xFFC7D2FE)
val Indigo50 = Color(0xFFEEF2FF)

val Rose700 = Color(0xFFBE123C)
val Rose600 = Color(0xFFE11D48)
val Rose200 = Color(0xFFFECDD3)
val Rose50 = Color(0xFFFFF1F2)

val Teal700 = Color(0xFF0F766E)
val Teal600 = Color(0xFF0D9488)
val Teal200 = Color(0xFF99F6E4)
val Teal50 = Color(0xFFF0FDFA)

// Neutral Slate Canvas & Surfaces (Untitled UI Specification)
val Slate950 = Color(0xFF090D16)
val Slate900 = Color(0xFF0F172A)
val Slate800 = Color(0xFF1E293B)
val Slate700 = Color(0xFF334155)
val Slate600 = Color(0xFF475569)
val Slate500 = Color(0xFF64748B)
val Slate400 = Color(0xFF94A3B8)
val Slate300 = Color(0xFFCBD5E1)
val Slate200 = Color(0xFFE2E8F0)
val Slate100 = Color(0xFFF1F5F9)
val Slate50 = Color(0xFFF8FAFC)

val WarmIvory = Color(0xFFF8FAFC)
val Crimson600 = Color(0xFFDC2626)

// Official MRM Brand Monogram Colors
val MrmBlue = Color(0xFF0095D9)
val MrmYellow = Color(0xFFF5B82E)
val MrmMint = Color(0xFF3EB489)

private val LightColorScheme = lightColorScheme(
    primary = Emerald600,
    onPrimary = Color.White,
    primaryContainer = Emerald50,
    onPrimaryContainer = Emerald700,
    secondary = MrmBlue,
    onSecondary = Color.White,
    tertiary = MrmYellow,
    background = Slate50,
    onBackground = Slate900,
    surface = Color.White,
    onSurface = Slate900,
    surfaceVariant = Slate100,
    onSurfaceVariant = Slate600,
    outline = Slate200
)

private val DarkColorScheme = darkColorScheme(
    primary = Emerald500,
    onPrimary = Emerald950,
    primaryContainer = Emerald900,
    onPrimaryContainer = Emerald100,
    secondary = MrmBlue,
    onSecondary = Color.White,
    tertiary = MrmYellow,
    background = Slate950,
    onBackground = Slate50,
    surface = Color(0xFF111827),
    onSurface = Slate50,
    surfaceVariant = Slate800,
    onSurfaceVariant = Slate400,
    outline = Color(0xFF1F2937)
)

@Composable
fun MrmCareTheme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
