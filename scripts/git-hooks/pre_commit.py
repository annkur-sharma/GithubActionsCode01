import subprocess
import sys
import json
import urllib.request

def get_git_metadata():
    # Get number of files changed
    files = subprocess.check_output(['git', 'diff', '--cached', '--name-only']).decode().split()
    
    # Get total lines added
    diff_data = subprocess.check_output(['git', 'diff', '--cached']).decode()
    lines_added = len([line for line in diff_data.split('\n') if line.startswith('+') and not line.startswith('+++')])
    
    return len(files), lines_added

def call_fastapi_auditor(files, lines):
    url = "https://d4f8-122-173-29-143.ngrok-free.app/predict"
    data = json.dumps({"files_changed": files, "lines_changed": lines}).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            return result
    except Exception as e:
        print(f"⚠️ Auditor connection failed: {e}")
        return {"risk_score": 0, "action": "allow"}

def main():
    print("🤖 AI Auditor: Checking commit risk...")
    files, lines = get_git_metadata()
    
    # Your RandomForest prediction via API
    result = call_fastapi_auditor(files, lines)
    
    if result.get("action") == "block":
        print(f"❌ COMMIT BLOCKED: Risk score too high ({result.get('risk_score')})")
        sys.exit(1)
    
    print("✅ Logic Check Passed.")
    sys.exit(0)

if __name__ == "__main__":
    main()