#!/usr/bin/env python3
"""
Phase 3 POC: Region and Model Discovery
Tests different regions to find working Vertex AI setup
"""

import sys

print("=" * 60)
print("Phase 3 POC: Finding Working Vertex AI Configuration")
print("=" * 60)

try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
    print(f"✅ Vertex AI SDK: {vertexai.__version__}")
except ImportError as e:
    print(f"❌ SDK not installed: {e}")
    sys.exit(1)

PROJECT_ID = "stitch-mcp-project-1769082170"

# Test multiple regions
regions = [
    "us-central1",      # Most common, best model availability
    "us-east1",         # Alternative US region
    "asia-northeast1",  # Tokyo (closer to Korea)
    "asia-northeast3",  # Seoul
]

models = [
    "gemini-1.5-flash-002",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
]

print("\n[Testing Regions and Models]")
print("-" * 60)

working_config = None

for region in regions:
    print(f"\n🌍 Region: {region}")
    try:
        vertexai.init(project=PROJECT_ID, location=region)
        
        for model_name in models:
            try:
                print(f"   Testing {model_name}...", end=" ")
                model = GenerativeModel(model_name)
                response = model.generate_content("Say 'OK'")
                if response.text:
                    print(f"✅ WORKS!")
                    working_config = {"region": region, "model": model_name}
                    break
            except Exception as e:
                error_msg = str(e)
                if "404" in error_msg:
                    print(f"❌ Not available")
                elif "403" in error_msg:
                    print(f"❌ Permission denied")
                else:
                    print(f"❌ {error_msg[:40]}...")
        
        if working_config:
            break
            
    except Exception as e:
        print(f"   ❌ Region init failed: {e}")

if not working_config:
    print("\n" + "=" * 60)
    print("❌ NO WORKING CONFIGURATION FOUND")
    print("=" * 60)
    print("\nPossible issues:")
    print("1. Vertex AI API not properly enabled")
    print("2. Billing account not linked")
    print("3. Insufficient permissions")
    print("\nManual steps:")
    print("1. Go to: https://console.cloud.google.com/vertex-ai")
    print("2. Enable Vertex AI API")
    print("3. Verify billing account is active")
    print("4. Try creating a test model in the console")
    sys.exit(1)

# Success!
print("\n" + "=" * 60)
print("🎉 FOUND WORKING CONFIGURATION!")
print("=" * 60)
print(f"\n✅ Region: {working_config['region']}")
print(f"✅ Model: {working_config['model']}")

# Test JSON generation
print("\n[Testing JSON Generation]")
try:
    vertexai.init(project=PROJECT_ID, location=working_config['region'])
    model = GenerativeModel(working_config['model'])
    response = model.generate_content(
        'Return only this JSON: {"status": "success", "test": "passed"}'
    )
    import json
    data = json.loads(response.text.strip())
    print(f"✅ JSON works: {data}")
except Exception as e:
    print(f"❌ JSON failed: {e}")

# Save configuration
print("\n[Saving Configuration]")
config = f"""# Vertex AI Configuration (Auto-discovered)

PROJECT_ID = "{PROJECT_ID}"
LOCATION = "{working_config['region']}"
MODEL_NAME = "{working_config['model']}"

# Usage:
# import vertexai
# from vertexai.generative_models import GenerativeModel
# 
# vertexai.init(project=PROJECT_ID, location=LOCATION)
# model = GenerativeModel(MODEL_NAME)
# response = model.generate_content("your prompt")
"""

with open("vertex_ai_config.py", "w") as f:
    f.write(config)

print(f"✅ Configuration saved to: vertex_ai_config.py")
print("\n" + "=" * 60)
print("Next Steps:")
print("=" * 60)
print("1. Update app.py to use this configuration")
print("2. Replace Gemini API imports with Vertex AI")
print("3. Test full application")
print(f"4. Monitor credit usage in GCP Console")
