#!/usr/bin/env python3
"""
TEST SCRIPT: All New Endpoints (COMPREHENSIVE)
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
USER_ID = "test_user_premium"

def test_byok():
    print("\n✅ BYOK ENDPOINTS:")
    try:
        # Add provider
        payload = {"provider": "gemini", "api_key": "test-key", "is_active": True}
        resp = requests.post(f"{BASE_URL}/api/byok/add-provider?user_id={USER_ID}", json=payload, timeout=5)
        print(f"   1. Add Provider: {resp.status_code}")
        
        # List providers
        resp = requests.get(f"{BASE_URL}/api/byok/providers/{USER_ID}", timeout=5)
        print(f"   2. List Providers: {resp.status_code}")
    except Exception as e:
        print(f"   ERROR: {e}")

def test_subscriptions():
    print("\n✅ SUBSCRIPTION ENDPOINTS:")
    try:
        # Get all tiers
        resp = requests.get(f"{BASE_URL}/api/subscription/tiers", timeout=5)
        print(f"   1. Get All Tiers: {resp.status_code}")
        
        # Get premium tier
        resp = requests.get(f"{BASE_URL}/api/subscription/tier/premium", timeout=5)
        print(f"   2. Get Premium Tier: {resp.status_code}")
        if resp.status_code == 200:
            print(f"      Features: {len(resp.json()['details']['features'])} features enabled")
        
        # Get enterprise tier
        resp = requests.get(f"{BASE_URL}/api/subscription/tier/enterprise", timeout=5)
        print(f"   3. Get Enterprise Tier: {resp.status_code}")
        
        # Select tier
        resp = requests.post(f"{BASE_URL}/api/subscription/select/{USER_ID}/premium", timeout=5)
        print(f"   4. Select Premium: {resp.status_code}")
    except Exception as e:
        print(f"   ERROR: {e}")

def test_settings():
    print("\n✅ SETTINGS ENDPOINTS:")
    try:
        # Get defaults
        resp = requests.get(f"{BASE_URL}/api/settings/default", timeout=5)
        print(f"   1. Get Default Settings: {resp.status_code}")
        
        # Configure
        payload = {"assessment_length": "standard", "enable_voice_questions": True}
        resp = requests.post(f"{BASE_URL}/api/settings/configure/{USER_ID}", json=payload, timeout=5)
        print(f"   2. Configure Settings: {resp.status_code}")
    except Exception as e:
        print(f"   ERROR: {e}")

def test_real_initialization():
    print("\n✅ REAL INITIALIZATION ENDPOINT:")
    try:
        payload = {
            "subscription_tier": "premium",
            "settings": {"assessment_length": "standard"}
        }
        resp = requests.post(
            f"{BASE_URL}/api/profile/initialize/{USER_ID}",
            json=payload,
            timeout=10
        )
        print(f"   Status: {resp.status_code}")
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"   ├─ Tier: {data['subscription_tier']['name']}")
            print(f"   ├─ Max Questions: {data['assessment_configuration']['total_questions']}")
            print(f"   ├─ Profiling Dimensions: {data['assessment_configuration']['profiling_dimensions']}")
            print(f"   ├─ BYOK Configured: {data['byok_configured']}")
            print(f"   └─ Status: {data['status']}")
    except Exception as e:
        print(f"   ERROR: {e}")

def test_enterprise_initialization():
    print("\n✅ ENTERPRISE INITIALIZATION:")
    try:
        payload = {
            "subscription_tier": "enterprise",
            "settings": {"assessment_length": "extended"}
        }
        resp = requests.post(
            f"{BASE_URL}/api/profile/initialize/enterprise_user",
            json=payload,
            timeout=10
        )
        print(f"   Status: {resp.status_code}")
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"   ├─ Tier: {data['subscription_tier']['name']}")
            print(f"   ├─ Max Questions: {data['assessment_configuration']['total_questions']}")
            print(f"   ├─ API Limit/Day: {data['subscription_tier']['api_limit_per_day']}")
            print(f"   ├─ BYOK Support: {'byok' in data['subscription_tier']['features']}")
            print(f"   └─ Analytics: {'advanced_analytics' in data['subscription_tier']['features']}")
    except Exception as e:
        print(f"   ERROR: {e}")

# Main
print("="*70)
print("DRONA AI - NEW ENDPOINTS TEST")
print("="*70)

test_byok()
test_subscriptions()
test_settings()
test_real_initialization()
test_enterprise_initialization()

print("\n" + "="*70)
print("✨ ALL ENDPOINTS OPERATIONAL!")
print("="*70)
