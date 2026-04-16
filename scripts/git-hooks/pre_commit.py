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

def get_git_info():
    """Fetches User, Repo, and Commit ID from local git config/history"""
    try:
        # Get User Name (from git config)
        user = subprocess.check_output(["git", "config", "user.name"]).decode('utf-8').strip()
        
        # Get Repo Name (from the remote URL, e.g., 'GithubActionsCode01')
        remote_url = subprocess.check_output(["git", "remote", "get-url", "origin"]).decode('utf-8').strip()
        repo = remote_url.split('/')[-1].replace('.git', '')
        
        # Get Current Commit Hash (as a draft Build ID)
        # We use 'HEAD' to see what the previous commit was, or 'draft' if it's brand new
        try:
            build_id = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode('utf-8').strip()
        except:
            build_id = "local_commit"

        return user, repo, build_id
    except Exception as e:
        return "local_dev", "unknown_repo", "local_draft"

def call_fastapi_auditor(add_count, del_count, file_count, files_data):
    # Your Ngrok URL
    url = "https://bca6-122-173-29-143.ngrok-free.app/predict"
    username, repo_name, current_sha = get_git_info()

    # Matching the payload structure of agent.py exactly
    payload = {
        "owner": username, # Or use subprocess to get git config user.name
        "repo": repo_name,
        "build_id": current_sha,  # Picks up the 40-char SHA
        "workflow": "local_pre_commit",
        "additions": add_count,
        "deletions": del_count,
        "files": file_count,
        "files_data": files_data
    }

    print(payload)
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode())
            return result
    except Exception as e:
        print(f"⚠️ [C.O.R.E.AI] Predictor connection failed: {e}")
        return {"risk_score": 0, "action": "allow"}

def main():
    print("🤖 C.O.R.E.AI Predictor: Checking local commit risk...")
    add_count, del_count, file_count, files_data = get_git_metadata()

    if file_count == 0:
        print("✅ [C.O.R.E.AI] - No staged changes detected.")
        sys.exit(0)

    # 1. Call API
    result = call_fastapi_auditor(add_count, del_count, file_count, files_data)
    
    # 2. Extract the actual prediction string from the response
    prediction = result.get("prediction", "UNKNOWN")
    txn_id = result.get("uuid", "N/A")

    # 3. Logic to show the prediction without blocking
    if prediction == "FAILURE":
        # Print in red/warning style but DO NOT sys.exit(1)
        print(f"⚠️ \033[91m [C.O.R.E.AI] PREDICTION: [FAILURE] - This commit is risky!\033[0m")
    elif prediction == "FLAKY":
        print(f"⚖️ \033[93m [C.O.R.E.AI] PREDICTION: [FLAKY] - Consistency warnings detected.\033[0m")
    else:
        print(f"✅ \033[92m [C.O.R.E.AI] PREDICTION: [SUCCESS] - Clean run expected.\033[0m")

    print(f"🔍 Audit Complete [TXN: {txn_id}]")
    
    # Always exit with 0 so the commit is never blocked
    sys.exit(0)

if __name__ == "__main__":
    main()