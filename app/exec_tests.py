import sys
import pytest
from pathlib import Path

def run_suite():
    scratch_dir = Path("scratch")
    scratch_dir.mkdir(parents=True, exist_ok=True)
    log_file = scratch_dir / "test_output.txt"

    class OutputLogger:
        def __init__(self, filename):
            self.terminal = sys.stdout
            self.log = open(filename, "w", encoding="utf-8")

        def write(self, message):
            self.terminal.write(message)
            self.log.write(message)

        def flush(self):
            self.terminal.flush()
            self.log.flush()

    sys.stdout = OutputLogger(log_file)
    print("Running Pytest suite...")
    code = pytest.main(["-v", "tests"])
    print(f"\nCompleted with exit code: {code}")
    sys.stdout.log.close()
    return code

if __name__ == "__main__":
    run_suite()
