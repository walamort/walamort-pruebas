package com.walamort.pulso;

import android.animation.ValueAnimator;
import android.os.Build;
import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen splash = SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        splash.setOnExitAnimationListener(provider -> {
            if (Build.VERSION.SDK_INT >= 26 && !ValueAnimator.areAnimatorsEnabled()) {
                provider.remove();
                return;
            }
            provider.getView().animate().alpha(0f).setDuration(160L)
                .withEndAction(provider::remove).start();
        });
    }
}
