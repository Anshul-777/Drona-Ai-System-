#!/usr/bin/env python3
"""
Drona AI — Environment Variables Validator
Validates that all required environment variables are properly configured
Usage: python validate_env.py [backend|frontend|all]
"""

import os
import sys
from pathlib import Path
from typing import Tuple, List, Dict

# Color codes for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"
BOLD = "\033[1m"


class EnvValidator:
    """Validates environment variables for Drona AI"""

    # TIER 1: Critical variables (must exist)
    BACKEND_CRITICAL = {
        "SUPABASE_URL": "Supabase project URL",
        "SUPABASE_KEY": "Supabase anon key",
        "SUPABASE_SERVICE_ROLE_KEY": "Supabase service role key",
        "DATABASE_URL": "PostgreSQL connection string",
        "JWT_SECRET": "JWT signing secret",
        "SECRET_KEY": "Application secret key",
    }

    # TIER 2: LLM Providers (at least one required)
    BACKEND_LLM_PROVIDERS = {
        "GEMINI_API_KEY": "Google Gemini API key",
        "GROQ_API_KEY": "Groq API key",
        "OPENAI_API_KEY": "OpenAI API key",
        "OPENROUTER_API_KEY": "OpenRouter API key",
    }

    # TIER 3: Recommended but optional
    BACKEND_RECOMMENDED = {
        "PINECONE_API_KEY": "Pinecone vector DB key",
        "PINECONE_INDEX_NAME": "Pinecone index name",
        "UPSTASH_REDIS_REST_URL": "Upstash Redis URL",
        "UPSTASH_QSTASH_TOKEN": "Upstash QStash token",
        "CLOUDFLARE_ACCOUNT_ID": "Cloudflare account ID",
        "SENDGRID_API_KEY": "SendGrid API key",
    }

    # Frontend critical (public-safe)
    FRONTEND_CRITICAL = {
        "NEXT_PUBLIC_API_URL": "Backend API URL",
        "NEXT_PUBLIC_SUPABASE_URL": "Supabase URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": "Supabase anon key",
    }

    FRONTEND_RECOMMENDED = {
        "NEXT_PUBLIC_POSTHOG_API_KEY": "PostHog analytics key",
        "NEXT_PUBLIC_RAZORPAY_KEY": "Razorpay public key",
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID": "Google OAuth client ID",
    }

    def __init__(self, env_file: str = ".env.local"):
        """Initialize validator with env file path"""
        self.env_file = env_file
        self.env_vars: Dict[str, str] = {}
        self.load_env()

    def load_env(self):
        """Load environment variables from .env file"""
        if os.path.exists(self.env_file):
            with open(self.env_file, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, value = line.split("=", 1)
                        self.env_vars[key.strip()] = value.strip()
        else:
            # Also load from system environment
            self.env_vars = dict(os.environ)

    def check_var(self, key: str) -> bool:
        """Check if a variable exists and is not empty"""
        value = self.env_vars.get(key, "").strip()
        return bool(value and value != "your-")

    def get_var_status(self, key: str) -> Tuple[str, str]:
        """Get status and value of a variable"""
        value = self.env_vars.get(key, "")
        if not value or value.startswith("your-"):
            return "❌ MISSING", ""
        # Don't print full values for security
        if len(value) > 20:
            return "✅ SET", f"({value[:20]}...)"
        return "✅ SET", f"({value})"

    def validate_backend(self) -> bool:
        """Validate backend environment variables"""
        print(f"\n{BOLD}{BLUE}🔧 BACKEND VALIDATION{RESET}")
        print("=" * 60)

        all_valid = True

        # Check critical variables
        print(f"\n{BOLD}TIER 1 - CRITICAL:{RESET}")
        for key, description in self.BACKEND_CRITICAL.items():
            status, value = self.get_var_status(key)
            if "❌" in status:
                all_valid = False
                print(f"{RED}{status} {key}{RESET}")
                print(f"   → {description}")
            else:
                print(f"{GREEN}{status} {key}{RESET} {value}")

        # Check LLM providers (at least one)
        print(f"\n{BOLD}TIER 2 - LLM PROVIDERS (need at least 1):{RESET}")
        llm_found = False
        for key, description in self.BACKEND_LLM_PROVIDERS.items():
            status, value = self.get_var_status(key)
            if "✅" in status:
                llm_found = True
                print(f"{GREEN}{status} {key}{RESET} {value}")
            else:
                print(f"{YELLOW}⭕ OPTIONAL {key}{RESET}")

        if not llm_found:
            print(f"{RED}❌ ERROR: At least one LLM provider required!{RESET}")
            all_valid = False
        else:
            print(f"{GREEN}✅ LLM provider configured{RESET}")

        # Check recommended variables
        print(f"\n{BOLD}TIER 3 - RECOMMENDED:{RESET}")
        missing_recommended = 0
        for key, description in self.BACKEND_RECOMMENDED.items():
            status, value = self.get_var_status(key)
            if "❌" in status:
                missing_recommended += 1
                print(f"{YELLOW}⭕ OPTIONAL {key}{RESET}")
            else:
                print(f"{GREEN}{status} {key}{RESET} {value}")

        if missing_recommended > 0:
            print(f"{YELLOW}⚠️  {missing_recommended} recommended variables not set{RESET}")

        # Check configuration values
        print(f"\n{BOLD}TIER 4 - CONFIGURATION VALUES:{RESET}")
        config_checks = [
            ("APP_ENV", ["development", "staging", "production"]),
            ("LOG_LEVEL", ["DEBUG", "INFO", "WARNING", "ERROR"]),
            ("JWT_ALGORITHM", ["HS256", "RS256"]),
        ]

        for key, valid_values in config_checks:
            value = self.env_vars.get(key, "").strip()
            if value in valid_values or value == "":
                status = "✅" if value else "⭕"
                print(f"{GREEN}{status} {key}{RESET} = {value or '(default)'}")
            else:
                print(f"{RED}❌ {key}{RESET} = {value} (invalid)")
                all_valid = False

        return all_valid

    def validate_frontend(self) -> bool:
        """Validate frontend environment variables"""
        print(f"\n{BOLD}{BLUE}🎨 FRONTEND VALIDATION{RESET}")
        print("=" * 60)

        all_valid = True

        # Check critical variables
        print(f"\n{BOLD}TIER 1 - CRITICAL:{RESET}")
        for key, description in self.FRONTEND_CRITICAL.items():
            status, value = self.get_var_status(key)
            if "❌" in status:
                all_valid = False
                print(f"{RED}{status} {key}{RESET}")
                print(f"   → {description}")
            else:
                print(f"{GREEN}{status} {key}{RESET} {value}")

        # Check recommended
        print(f"\n{BOLD}TIER 2 - RECOMMENDED:{RESET}")
        missing = 0
        for key, description in self.FRONTEND_RECOMMENDED.items():
            status, value = self.get_var_status(key)
            if "❌" in status:
                missing += 1
                print(f"{YELLOW}⭕ OPTIONAL {key}{RESET}")
            else:
                print(f"{GREEN}{status} {key}{RESET} {value}")

        if missing > 0:
            print(f"{YELLOW}⚠️  {missing} recommended variables not set{RESET}")

        # Check theme colors
        print(f"\n{BOLD}TIER 3 - THEME COLORS:{RESET}")
        colors = [
            "NEXT_PUBLIC_COLOR_MAIN_LEARNING",
            "NEXT_PUBLIC_COLOR_TEST",
            "NEXT_PUBLIC_COLOR_GAME",
        ]
        for key in colors:
            status, value = self.get_var_status(key)
            symbol = "🎨" if "✅" in status else "⭕"
            print(f"{symbol} {key} {value}")

        return all_valid

    def validate_security(self) -> bool:
        """Check for security issues"""
        print(f"\n{BOLD}{BLUE}🔒 SECURITY CHECKS{RESET}")
        print("=" * 60)

        all_secure = True

        # Check for weak secrets
        print(f"\n{BOLD}Secret Strength:{RESET}")
        for key in ["JWT_SECRET", "SECRET_KEY"]:
            value = self.env_vars.get(key, "")
            if len(value) < 32:
                print(f"{RED}❌ {key}{RESET}: Too short (< 32 chars)")
                all_secure = False
            elif value.startswith("your-"):
                print(f"{RED}❌ {key}{RESET}: Still using template value!")
                all_secure = False
            else:
                print(f"{GREEN}✅ {key}{RESET}: Good length")

        # Check for exposed secrets (no public LLM keys)
        print(f"\n{BOLD}Secret Exposure:{RESET}")
        secret_vars = ["GEMINI_API_KEY", "GROQ_API_KEY", "PINECONE_API_KEY"]
        for key in secret_vars:
            if key in self.env_vars and self.env_vars[key]:
                # Check if it's a backend .env file
                if ".env.local" in self.env_file or "backend" in self.env_file.lower():
                    print(f"{GREEN}✅ {key}{RESET}: In backend (OK)")
                else:
                    print(
                        f"{RED}❌ {key}{RESET}: Should not be in frontend!{RESET}"
                    )
                    all_secure = False

        return all_secure

    def print_summary(self, backend_valid: bool, frontend_valid: bool):
        """Print validation summary"""
        print(f"\n{BOLD}{BLUE}📊 SUMMARY{RESET}")
        print("=" * 60)

        if backend_valid:
            print(f"{GREEN}✅ Backend configuration: VALID{RESET}")
        else:
            print(f"{RED}❌ Backend configuration: INVALID{RESET}")

        if frontend_valid:
            print(f"{GREEN}✅ Frontend configuration: VALID{RESET}")
        else:
            print(f"{RED}❌ Frontend configuration: INVALID{RESET}")

        if backend_valid and frontend_valid:
            print(f"\n{GREEN}{BOLD}🎉 All systems ready for development!{RESET}\n")
            return 0
        else:
            print(f"\n{RED}{BOLD}⚠️  Please fix the issues above before proceeding{RESET}\n")
            return 1

    def run(self, target: str = "all") -> int:
        """Run validation"""
        print(f"\n{BOLD}{BLUE}Drona AI — Environment Validator{RESET}")
        print(f"Checking: {self.env_file}\n")

        backend_valid = True
        frontend_valid = True

        if target in ["backend", "all"]:
            backend_valid = self.validate_backend()
            self.validate_security()

        if target in ["frontend", "all"]:
            frontend_valid = self.validate_frontend()

        return self.print_summary(backend_valid, frontend_valid)


def main():
    """Main entry point"""
    if len(sys.argv) > 1:
        target = sys.argv[1].lower()
        if target == "backend":
            validator = EnvValidator("drona-AI Backend/.env.local")
            sys.exit(validator.run("backend"))
        elif target == "frontend":
            validator = EnvValidator("drona-AI Frontend/.env.local")
            sys.exit(validator.run("frontend"))
        else:
            print(f"Usage: {sys.argv[0]} [backend|frontend|all]")
            sys.exit(1)
    else:
        # Validate both
        print(f"\n{BOLD}Validating Backend...{RESET}")
        backend_validator = EnvValidator("drona-AI Backend/.env.local")
        backend_valid = backend_validator.run("backend")
        backend_validator.validate_security()

        print(f"\n{BOLD}Validating Frontend...{RESET}")
        frontend_validator = EnvValidator("drona-AI Frontend/.env.local")
        frontend_valid = frontend_validator.run("frontend")

        print(f"\n{BOLD}{BLUE}FINAL RESULT{RESET}")
        print("=" * 60)
        if backend_valid and frontend_valid:
            print(f"{GREEN}✅ All environments configured correctly!{RESET}\n")
            return 0
        else:
            print(f"{RED}❌ Some issues found. Please review above.{RESET}\n")
            return 1


if __name__ == "__main__":
    sys.exit(main())
