import subprocess
import sys
import json
import urllib.request

def get_git_metadata():
    try:
        # Using --numstat to get additions, deletions, and filenames (staged changes only)
        # This matches the 'granular' logic in your agent.py
        cmd = ["git", "diff", "--cached", "--numstat"]
        result = subprocess.check_output(cmd).decode('utf-8')
        
        files_data = []
        total_a, total_d = 0, 0
        
        if not result.strip():
            return 0, 0, 0, []

        for line in result.strip().split('\n'):
            # Handle cases where files might be renamed or have special characters
            parts = line.split('\t')
            if len(parts) == 3:
                a, d, name = parts
                # Handle binary files which show '-' instead of numbers
                a_val = int(a) if a.isdigit() else 0
                d_val = int(d) if d.isdigit() else 0
                
                files_data.append({"file": name, "a": a_val, "d": d_val})
                total_a += a_val
                total_d += d_val
        
        return total_a, total_d, len(files_data), files_data
    except Exception as e:
        print(f"Error gathering local git stats: {e}")
        return 0, 0, 0, []

def call_fastapi_auditor(add, del_count, file_count, files_data):
    # Your Ngrok URL
    url = "https://973e-122-173-29-143.ngrok-free.app/predict"
    
    # Matching the payload structure of agent.py exactly
    payload = {
        "additions": add,
        "deletions": del_count,
        "files": file_count,
        "files_data": files_data,
        "source": "local_pre_commit" # Good to tell your API this is local!
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode())
            return result
    except Exception as e:
        print(f"⚠️ Auditor connection failed: {e}")
        return {"risk_score": 0, "action": "allow"}

def main():
    print("🤖 AI Auditor: Checking local commit risk...")
    add, del_count, file_count, files_data = get_git_metadata()
    
    if file_count == 0:
        print("✅ No staged changes detected.")
        sys.exit(0)

    # Call API with expanded metrics
    result = call_fastapi_auditor(add, del_count, file_count, files_data)
    
    risk_score = result.get("risk_score", 0)
    action = result.get("action", "allow")

    if action == "block":
        print(f"❌ COMMIT BLOCKED: Risk score too high ({risk_score})")
        # You could also print the reason if your API returns one
        sys.exit(1)
    
    print(f"✅ AI Audit Passed (Score: {risk_score}).")
    sys.exit(0)

if __name__ == "__main__":
    main()