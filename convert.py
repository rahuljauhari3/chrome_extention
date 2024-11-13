import os
from PIL import Image
import sys

def convert_images(input_folder, output_folder, n, m):
    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Loop through all files in the input folder
    for filename in os.listdir(input_folder):
        # if filename.lower().endswith(".png"):  # Check for PNG files only
        input_path = os.path.join(input_folder, filename)
        output_filename = os.path.splitext(filename)[0] + ".jpg"  # Change extension to .jpg
        output_path = os.path.join(output_folder, output_filename)
        
        # Open, convert, resize, and save the image
        with Image.open(input_path) as img:
            img = img.convert("RGB")  # JPEG does not support transparency
            img = img.resize((n, m))
            img.save(output_path, format="JPEG")
        
        print(f"Converted {filename} and saved as {output_filename} with resolution {n}x{m}")

if __name__ == "__main__":
    # Check if enough arguments are provided
    if len(sys.argv) != 5:
        print("Usage: python convert_folder.py <input_folder> <output_folder> <n> <m>")
    else:
        input_folder = sys.argv[1]
        output_folder = sys.argv[2]
        n = int(sys.argv[3])
        m = int(sys.argv[4])

        # Run the conversion function
        convert_images(input_folder, output_folder, n, m)
