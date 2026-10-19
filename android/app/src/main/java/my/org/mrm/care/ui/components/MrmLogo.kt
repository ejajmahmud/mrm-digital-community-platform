package my.org.mrm.care.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Official Multiracial Reverted Muslims (MRM) Vector Monogram in Jetpack Compose Canvas
 * - Left 'M': Vibrant Cyan-Blue (#0095D9) double Islamic pointed arch
 * - Center 'R': Warm Golden-Yellow (#F5B82E) Islamic pointed arch with kick leg
 * - Right 'M': Soft Emerald-Mint (#3EB489) double Islamic pointed arch
 */
@Composable
fun MrmLogoBadge(
    modifier: Modifier = Modifier,
    width: Dp = 46.dp,
    height: Dp = 32.dp
) {
    Box(
        modifier = modifier
            .size(width = width, height = height)
            .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(10.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(10.dp))
            .padding(horizontal = 4.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(width = width - 8.dp, height = height - 8.dp)) {
            val sx = size.width / 168f
            val sy = size.height / 76f
            val strokeW = 7.2f * sx

            val blueColor = Color(0xFF0095D9)
            val yellowColor = Color(0xFFF5B82E)
            val mintColor = Color(0xFF3EB489)

            // Left M (Blue)
            val leftM = Path().apply {
                moveTo(10f * sx, 54f * sy)
                lineTo(10f * sx, 28f * sy)
                cubicTo(10f * sx, 17f * sy, 18f * sx, 9f * sy, 23f * sx, 5f * sy)
                cubicTo(28f * sx, 9f * sy, 36f * sx, 17f * sy, 36f * sx, 28f * sy)
                lineTo(36f * sx, 54f * sy)

                moveTo(36f * sx, 54f * sy)
                lineTo(36f * sx, 28f * sy)
                cubicTo(36f * sx, 17f * sy, 44f * sx, 9f * sy, 49f * sx, 5f * sy)
                cubicTo(54f * sx, 9f * sy, 62f * sx, 17f * sy, 62f * sx, 28f * sy)
                lineTo(62f * sx, 54f * sy)
            }
            drawPath(
                path = leftM,
                color = blueColor,
                style = Stroke(width = strokeW, cap = StrokeCap.Round, join = StrokeJoin.Round)
            )

            // Center R (Golden Yellow)
            val centerR = Path().apply {
                moveTo(62f * sx, 54f * sy)
                lineTo(62f * sx, 28f * sy)
                cubicTo(62f * sx, 16f * sy, 71f * sx, 8f * sy, 78f * sx, 4f * sy)
                cubicTo(86f * sx, 9f * sy, 92f * sx, 18f * sy, 89f * sx, 27f * sy)
                cubicTo(87f * sx, 33f * sy, 80f * sx, 37f * sy, 70f * sx, 37f * sy)
                lineTo(90f * sx, 54f * sy)
            }
            drawPath(
                path = centerR,
                color = yellowColor,
                style = Stroke(width = strokeW, cap = StrokeCap.Round, join = StrokeJoin.Round)
            )

            // Right M (Emerald Mint)
            val rightM = Path().apply {
                moveTo(90f * sx, 54f * sy)
                lineTo(90f * sx, 28f * sy)
                cubicTo(90f * sx, 17f * sy, 98f * sx, 9f * sy, 103f * sx, 5f * sy)
                cubicTo(108f * sx, 9f * sy, 116f * sx, 17f * sy, 116f * sx, 28f * sy)
                lineTo(116f * sx, 54f * sy)

                moveTo(116f * sx, 54f * sy)
                lineTo(116f * sx, 28f * sy)
                cubicTo(116f * sx, 17f * sy, 124f * sx, 9f * sy, 129f * sx, 5f * sy)
                cubicTo(134f * sx, 9f * sy, 142f * sx, 17f * sy, 142f * sx, 28f * sy)
                lineTo(142f * sx, 54f * sy)
            }
            drawPath(
                path = rightM,
                color = mintColor,
                style = Stroke(width = strokeW, cap = StrokeCap.Round, join = StrokeJoin.Round)
            )
        }
    }
}
