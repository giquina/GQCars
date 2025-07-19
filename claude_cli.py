#!/usr/bin/env python3
import anthropic
import sys
import os

def main():
    if len(sys.argv) < 2:
        print("Usage: python claude_cli.py 'your prompt here'")
        print("Example: python claude_cli.py 'Create a React Native app'")
        return
    
    # You'll need to set your API key
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("Please set ANTHROPIC_API_KEY environment variable")
        print("You can get an API key from: https://console.anthropic.com/")
        return
    
    client = anthropic.Anthropic(api_key=api_key)
    prompt = " ".join(sys.argv[1:])
    
    try:
        message = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        print(message.content[0].text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
