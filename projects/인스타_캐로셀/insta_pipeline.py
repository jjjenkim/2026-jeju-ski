import os
import json
from pathlib import Path
from google import genai
from google.genai import types

# Configuration class
class Config:
    def __init__(self):
        self.api_key = "AIzaSyAlJVS0jPel7Ozia2qHC3A41k9aBQMN3Xs"
        self.text_model_name = 'gemini-2.0-flash'
        self.image_model_name = "imagen-4.0-generate-001"
        self.base_dir = Path(__file__).parent
        self.output_dir = self.base_dir / "03_English_Test_Fixed_Colors"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.config_path = self.base_dir / "config.py"
        self.instagram_aspect_ratio = '3:4'
        self.slides_count = 7
        self.topic = 'A Beginner\'s Guide to the FIS World Cup'
        self.audience = 'Skiing beginners'
        self.color_palette = 'Navy #0B1220, White #FFFFFF, Gold #FBBF24'
        self.tone = 'Professional but friendly'

config = Config()

# Initialize Client
client = genai.Client(api_key=config.api_key)

# Step 1: Generate PRD and slide text content using Gemini
def generate_prd_and_slides():
    print(f"Generating PRD using {config.text_model_name}...")
    
    prd_prompt = f'''
=== SYSTEM ===
You are an expert content designer for Instagram carousels.

=== CONFIG ===
Topic: {config.topic}
Audience: {config.audience}
Number of Slides: {config.slides_count}
Color Palette: {config.color_palette}
Tone: {config.tone}

=== TASK ===
1. Write a Product Requirements Document (PRD) for an Instagram carousel about the topic.
2. Create the **text content for each slide in clear, fluent English**.

Output Format (JSON only):
{{"prd": "Full PRD summary in English", "slides": [{{"number": 1, "title": "Slide Title in English", "text": "Slide content text in English"}}]}}
'''

    try:
        response = client.models.generate_content(
            model=config.text_model_name,
            contents=prd_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        content = response.text.strip()
        prd_json = json.loads(content)
        return prd_json

    except Exception as e:
        print(f"Error generating text: {e}")
        return None

# Step 2: Generate Image Prompt for a single slide
def generate_image_prompt(slide):
    # Strip markdown (e.g., bolding **) from the text
    clean_title = slide['title'].replace('**', '')
    clean_content = slide['text'].replace('**', '')
    
    prompt = f"""
A dynamic, high-quality Instagram carousel image. Aspect ratio: {config.instagram_aspect_ratio}. 

Visuals: A background depicting the excitement of FIS World Cup skiing, featuring professional skiers in action on snowy slopes, or abstract elements representing speed and precision. **Crucially, the design must strictly adhere to the following color palette: Navy (#0B1220) for backgrounds, White (#FFFFFF) and Gold (#FBBF24) for text and accents.**

Text Overlay: 
Place the following title prominently on the image, centered at the top:
{clean_title}

Place the following content text below the title, clearly readable:
{clean_content}

Ensure the English text is rendered clearly and legibly on the image, using a modern, bold sans-serif font for the title and a clear sans-serif font for the content. The text should be white or gold for high contrast against the navy background elements.
"""
    return prompt

# Step 3: Generate images using Imagen
def generate_images(prd_json):
    if not prd_json:
        return []

    Path(config.output_dir).mkdir(exist_ok=True)
    generated_images = []

    for slide in prd_json.get('slides', []):
        print(f"Generating image for slide {slide['number']}...")
        image_prompt = generate_image_prompt(slide)
        
        try:
            response = client.models.generate_images(
                model=config.image_model_name,
                prompt=image_prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio=config.instagram_aspect_ratio,
                )
            )
            
            if response.generated_images:
                img_obj = response.generated_images[0]
                ext = ".png"
                if hasattr(img_obj.image, 'mime_type') and img_obj.image.mime_type == "image/jpeg":
                    ext = ".jpg"
                
                filename = f"{config.output_dir}/slide-{slide['number']:02d}{ext}"
                
                if hasattr(img_obj.image, 'image_bytes'):
                    with open(filename, 'wb') as f:
                        f.write(img_obj.image.image_bytes)
                elif hasattr(img_obj.image, 'save'):
                    img_obj.image.save(filename)
                
                print(f"  -> Saved {filename}")
                generated_images.append(filename)
            else:
                print(f"Warning: No image data returned for slide {slide['number']}.")
        except Exception as e:
            print(f"An error occurred: {e}")
            
    return generated_images

# Main pipeline
def main():
    print("=== Instagram Carousel Pipeline: English Test (Fixed Colors) ===")
    prd_json = generate_prd_and_slides()
    if not prd_json: return

    print("\n=== Generated PRD Summary ===")
    print(prd_json.get('prd', 'No summary'))
    
    print("\nStep 2 & 3: Generating Images with AI Text Overlay...")
    images = generate_images(prd_json)
    
    print("\n=== Generated Images ===")
    for img in images: print(f"- {img}")

    print("\n✅ Pipeline complete! Check the '03_English_Test_Fixed_Colors' directory.")

if __name__ == '__main__':
    main()
