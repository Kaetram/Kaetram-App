package com.kaetram.app

import android.view.KeyEvent

class MainActivity : TauriActivity() {
  private lateinit var mWebView: RustWebView

  private fun setWebView(webView: RustWebView) {
    mWebView = webView
  }

  override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
    if (keyCode == KeyEvent.KEYCODE_BACK && mWebView.canGoBack()) {
      mWebView.goBack()

      return true
    }

    return super.onKeyDown(keyCode, event)
  }
}
