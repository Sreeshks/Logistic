import sys
import pytest

def main():
    print("Executing pytest test suite...")
    exit_code = pytest.main(["-v", "tests"])
    print(f"Pytest exited with status code: {exit_code}")
    return exit_code

if __name__ == "__main__":
    sys.exit(main())
