import google.generativeai as genai
import os

def get_fallback_chat_response(system_instruction, history, message, original_key):
    """Tries the original key, then cycles through fallback keys if quota is exceeded."""
    fallback_env = os.environ.get("GEMINI_FALLBACK_KEYS", "")
    FALLBACK_KEYS = [k.strip() for k in fallback_env.split(",")] if fallback_env else []
    keys_to_try = [original_key] + FALLBACK_KEYS
    
    for current_key in keys_to_try:
        try:
            genai.configure(api_key=current_key)
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=system_instruction
            )
            chat_session = model.start_chat(history=history)
            response = chat_session.send_message(message)
            
            # Reset back to original key before returning
            genai.configure(api_key=original_key)
            return response.text
            
        except Exception as e:
            error_str = str(e).lower()
            if "429" in error_str or "quota" in error_str or "exhausted" in error_str or "403" in error_str or "leaked" in error_str or "invalid" in error_str:
                print(f"[API Fallback] Key starting with {current_key[:10]}... failed ({error_str[:30]}). Trying next...")
                continue # Try next key
            else:
                genai.configure(api_key=original_key)
                raise e # If it's a different error, throw it
                
    genai.configure(api_key=original_key)
    raise Exception("All Gemini API keys have exceeded their quotas! Please add more fallback keys or upgrade to Premium.")


def get_fallback_title(prompt, original_key):
    """Same as above, but for generating chat titles."""
    fallback_env = os.environ.get("GEMINI_FALLBACK_KEYS", "")
    FALLBACK_KEYS = [k.strip() for k in fallback_env.split(",")] if fallback_env else []
    keys_to_try = [original_key] + FALLBACK_KEYS
    
    for current_key in keys_to_try:
        try:
            genai.configure(api_key=current_key)
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(prompt)
            genai.configure(api_key=original_key)
            return response.text.strip().replace('"', '')
            
        except Exception as e:
            error_str = str(e).lower()
            if "429" in error_str or "quota" in error_str or "exhausted" in error_str or "403" in error_str or "leaked" in error_str or "invalid" in error_str:
                continue
            else:
                genai.configure(api_key=original_key)
                raise e
                
    genai.configure(api_key=original_key)

def get_fallback_chat_response_with_file(system_instruction, history, message, original_key, file_path, mime_type):
    """Uploads a file to Gemini and generates a response."""
    fallback_env = os.environ.get("GEMINI_FALLBACK_KEYS", "")
    FALLBACK_KEYS = [k.strip() for k in fallback_env.split(",")] if fallback_env else []
    keys_to_try = [original_key] + FALLBACK_KEYS
    
    for current_key in keys_to_try:
        try:
            genai.configure(api_key=current_key)
            
            # Upload file directly to Gemini
            uploaded_file = genai.upload_file(file_path, mime_type=mime_type)
            
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=system_instruction
            )
            
            # We can't pass files in history easily, so we just start a chat and pass the file with the message
            chat_session = model.start_chat(history=history)
            response = chat_session.send_message([uploaded_file, message])
            
            # Cleanup the file from Gemini servers if possible
            try:
                uploaded_file.delete()
            except:
                pass
                
            genai.configure(api_key=original_key)
            return response.text
            
        except Exception as e:
            error_str = str(e).lower()
            if "429" in error_str or "quota" in error_str or "exhausted" in error_str or "403" in error_str or "leaked" in error_str or "invalid" in error_str:
                continue
            else:
                genai.configure(api_key=original_key)
                raise e
                
    genai.configure(api_key=original_key)
    raise Exception("All Gemini API keys have exceeded their quotas! Please add more fallback keys or upgrade to Premium.")
