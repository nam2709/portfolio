'use client'
import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import { useEffect } from 'react';

import { CookieStorage } from 'aws-amplify/utils'

// only initialize when in the browser
if (
  typeof window !== 'undefined' &&
  // process.env.STAGE === 'PRODUCTION' &&
  process.env.NEXT_PUBLIC_LOGROCKET_ID
) {
  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_ID, {
    release: '1.0.0',
    shouldCaptureIP: true,
    rootHostname: 'kamarket.vn',
  })
  // plugins should also only be initialized when in the browser
  setupLogRocketReact(LogRocket)
}

if (typeof window !== 'undefined') {
  window.LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL
}

import config from './amplify.config'
Amplify.configure(config, { ssr: true })

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage())

export default function ConfigureAmplifyClientSide() {
  useEffect(() => {
    // Only add the script once
    if (!window.drift) {
      !function() {
        var t = window.driftt = window.drift = window.driftt || [];
        if (!t.init) {
          if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
          t.invoked = !0, t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ],
          t.factory = function(e) {
            return function() {
              var n = Array.prototype.slice.call(arguments);
              return n.unshift(e), t.push(n), t;
            };
          }, t.methods.forEach(function(e) {
            t[e] = t.factory(e);
          }), t.load = function(t) {
            var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
            o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
            var i = document.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(o, i);
          };
        }
      }();
      drift.SNIPPET_VERSION = '0.3.1';
      drift.load('fpkurk35cmyz'); // Replace 'YOUR_DRIFT_ID' with your actual Drift ID
    }
  }, []);
  return null
}
