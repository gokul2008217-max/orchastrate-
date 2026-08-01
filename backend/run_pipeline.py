import os
import sys

# Add parent dir to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.services.output_generator import OutputGenerator

if __name__ == "__main__":
    generator = OutputGenerator(dataset_dir="dataset")
    results = generator.generate_output_csv("output.csv")
    print(f"Pipeline executed successfully. Generated {len(results)} rows in output.csv.")
