// Author: Daniele Giardini - http://www.demigiant.com
// Created: 2014/07/19 14:11
// 
// License Copyright (c) Daniele Giardini.
// This work is subject to the terms at http://dotween.demigiant.com/license.php
// 
// =============================================================
// Contains Daniele Giardini's C# port of the easing equations created by Robert Penner
// (all easing equations except for Flash, InFlash, OutFlash, InOutFlash,
// which use some parts of Robert Penner's equations but were created by Daniele Giardini)
// http://robertpenner.com/easing, see license below:
// =============================================================
//
// TERMS OF USE - EASING EQUATIONS
//
// Open source under the BSD License.
//
// Copyright ? 2001 Robert Penner
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// - Redistributions of source code must retain the above copyright notice,
// this list of conditions and the following disclaimer.
// - Redistributions in binary form must reproduce the above copyright notice,
// this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
// - Neither the name of the author nor the names of contributors may be used to endorse
// or promote products derived} from this software without specific prior written permission.
// - THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
// IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
import { EaseType } from "./EaseType";
const _PiOver2 = Math.PI * 0.5;
const _TwoPi = Math.PI * 2;
export function evaluateEase(easeType, time, duration, overshootOrAmplitude, period) {
    switch (easeType) {
        case EaseType.Linear:
            return time / duration;
        case EaseType.SineIn:
            return -Math.cos(time / duration * _PiOver2) + 1;
        case EaseType.SineOut:
            return Math.sin(time / duration * _PiOver2);
        case EaseType.SineInOut:
            return -0.5 * (Math.cos(Math.PI * time / duration) - 1);
        case EaseType.QuadIn:
            return (time /= duration) * time;
        case EaseType.QuadOut:
            return -(time /= duration) * (time - 2);
        case EaseType.QuadInOut:
            if ((time /= duration * 0.5) < 1)
                return 0.5 * time * time;
            return -0.5 * ((--time) * (time - 2) - 1);
        case EaseType.CubicIn:
            return (time /= duration) * time * time;
        case EaseType.CubicOut:
            return ((time = time / duration - 1) * time * time + 1);
        case EaseType.CubicInOut:
            if ((time /= duration * 0.5) < 1)
                return 0.5 * time * time * time;
            return 0.5 * ((time -= 2) * time * time + 2);
        case EaseType.QuartIn:
            return (time /= duration) * time * time * time;
        case EaseType.QuartOut:
            return -((time = time / duration - 1) * time * time * time - 1);
        case EaseType.QuartInOut:
            if ((time /= duration * 0.5) < 1)
                return 0.5 * time * time * time * time;
            return -0.5 * ((time -= 2) * time * time * time - 2);
        case EaseType.QuintIn:
            return (time /= duration) * time * time * time * time;
        case EaseType.QuintOut:
            return ((time = time / duration - 1) * time * time * time * time + 1);
        case EaseType.QuintInOut:
            if ((time /= duration * 0.5) < 1)
                return 0.5 * time * time * time * time * time;
            return 0.5 * ((time -= 2) * time * time * time * time + 2);
        case EaseType.ExpoIn:
            return (time == 0) ? 0 : Math.pow(2, 10 * (time / duration - 1));
        case EaseType.ExpoOut:
            if (time == duration)
                return 1;
            return (-Math.pow(2, -10 * time / duration) + 1);
        case EaseType.ExpoInOut:
            if (time == 0)
                return 0;
            if (time == duration)
                return 1;
            if ((time /= duration * 0.5) < 1)
                return 0.5 * Math.pow(2, 10 * (time - 1));
            return 0.5 * (-Math.pow(2, -10 * --time) + 2);
        case EaseType.CircIn:
            return -(Math.sqrt(1 - (time /= duration) * time) - 1);
        case EaseType.CircOut:
            return Math.sqrt(1 - (time = time / duration - 1) * time);
        case EaseType.CircInOut:
            if ((time /= duration * 0.5) < 1)
                return -0.5 * (Math.sqrt(1 - time * time) - 1);
            return 0.5 * (Math.sqrt(1 - (time -= 2) * time) + 1);
        case EaseType.ElasticIn:
            var s0;
            if (time == 0)
                return 0;
            if ((time /= duration) == 1)
                return 1;
            if (period == 0)
                period = duration * 0.3;
            if (overshootOrAmplitude < 1) {
                overshootOrAmplitude = 1;
                s0 = period / 4;
            }
            else
                s0 = period / _TwoPi * Math.asin(1 / overshootOrAmplitude);
            return -(overshootOrAmplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s0) * _TwoPi / period));
        case EaseType.ElasticOut:
            var s1;
            if (time == 0)
                return 0;
            if ((time /= duration) == 1)
                return 1;
            if (period == 0)
                period = duration * 0.3;
            if (overshootOrAmplitude < 1) {
                overshootOrAmplitude = 1;
                s1 = period / 4;
            }
            else
                s1 = period / _TwoPi * Math.asin(1 / overshootOrAmplitude);
            return (overshootOrAmplitude * Math.pow(2, -10 * time) * Math.sin((time * duration - s1) * _TwoPi / period) + 1);
        case EaseType.ElasticInOut:
            var s;
            if (time == 0)
                return 0;
            if ((time /= duration * 0.5) == 2)
                return 1;
            if (period == 0)
                period = duration * (0.3 * 1.5);
            if (overshootOrAmplitude < 1) {
                overshootOrAmplitude = 1;
                s = period / 4;
            }
            else
                s = period / _TwoPi * Math.asin(1 / overshootOrAmplitude);
            if (time < 1)
                return -0.5 * (overshootOrAmplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - s) * _TwoPi / period));
            return overshootOrAmplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - s) * _TwoPi / period) * 0.5 + 1;
        case EaseType.BackIn:
            return (time /= duration) * time * ((overshootOrAmplitude + 1) * time - overshootOrAmplitude);
        case EaseType.BackOut:
            return ((time = time / duration - 1) * time * ((overshootOrAmplitude + 1) * time + overshootOrAmplitude) + 1);
        case EaseType.BackInOut:
            if ((time /= duration * 0.5) < 1)
                return 0.5 * (time * time * (((overshootOrAmplitude *= (1.525)) + 1) * time - overshootOrAmplitude));
            return 0.5 * ((time -= 2) * time * (((overshootOrAmplitude *= (1.525)) + 1) * time + overshootOrAmplitude) + 2);
        case EaseType.BounceIn:
            return bounce_easeIn(time, duration);
        case EaseType.BounceOut:
            return bounce_easeOut(time, duration);
        case EaseType.BounceInOut:
            return bounce_easeInOut(time, duration);
        default:
            return -(time /= duration) * (time - 2);
    }
}
function bounce_easeIn(time, duration) {
    return 1 - bounce_easeOut(duration - time, duration);
}
function bounce_easeOut(time, duration) {
    if ((time /= duration) < (1 / 2.75)) {
        return (7.5625 * time * time);
    }
    if (time < (2 / 2.75)) {
        return (7.5625 * (time -= (1.5 / 2.75)) * time + 0.75);
    }
    if (time < (2.5 / 2.75)) {
        return (7.5625 * (time -= (2.25 / 2.75)) * time + 0.9375);
    }
    return (7.5625 * (time -= (2.625 / 2.75)) * time + 0.984375);
}
function bounce_easeInOut(time, duration) {
    if (time < duration * 0.5) {
        return bounce_easeIn(time * 2, duration) * 0.5;
    }
    return bounce_easeOut(time * 2 - duration, duration) * 0.5 + 0.5;
}
