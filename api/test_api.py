import requests
import json

def test_api():
    # Test the API endpoint
    url = "http://localhost:8000/humanize"
    headers = {
        "Authorization": "Bearer test-secret",
        "Content-Type": "application/json"
    }
    data = {
        "text": "This is AI-generated content."
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print("Server is not running. Starting server...")
        return False

if __name__ == "__main__":
    test_api() 