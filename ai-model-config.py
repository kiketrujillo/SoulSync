# ai_service/model_config.py
"""
Configuration for the AI Soul Guide model.
This is where we define the model parameters and configuration.
"""
import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# Model configuration
MODEL_ID = os.getenv("DISTILGPT2_MODEL_ID", "distilgpt2")
MAX_LENGTH = int(os.getenv("MAX_RESPONSE_LENGTH", "150"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))
TOP_P = float(os.getenv("TOP_P", "0.9"))
TOP_K = int(os.getenv("TOP_K", "50"))
REPETITION_PENALTY = float(os.getenv("REPETITION_PENALTY", "1.2"))
USE_CACHE = os.getenv("USE_MODEL_CACHE", "true").lower() == "true"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Prompt templates for different types of responses
TEMPLATES = {
    "tarot_reading": """
You are a wise and insightful tarot reader. Analyze the following tarot card(s) for the querent's situation:
Cards: {cards}
Question or Focus: {question}
Current Influences: {influences}

Your Interpretation:
""",
    "journal_analysis": """
You are a spiritual guide with deep insights. Analyze the following journal entry for patterns and cosmic insights:
Entry: {entry}
Astrological Transits: {transits}
Emotional Theme: {mood}

Your Spiritual Analysis:
""",
    "dream_interpretation": """
You are a dream interpreter with knowledge of spiritual symbolism. Interpret the following dream:
Dream: {dream}
Dreamer's Zodiac Sign: {sign}
Current Astrological Phase: {moon_phase}

Your Interpretation of the Symbols and Meaning:
""",
    "soul_guide_chat": """
You are a compassionate Soul Guide who helps people navigate their spiritual journey. Your responses are insightful, 
empathetic, and sprinkled with cosmic wisdom. You relate personal experiences to the cosmos.

User's Current Mood: {mood}
User's Zodiac Sign: {sign}
Current Astrological Transits: {transits}
User's Question: {question}

Your Guidance:
"""
}

def load_model():
    """
    Load and prepare the model for inference.
    For production, we would fine-tune this model on spiritual/astrological data.
    """
    print(f"Loading model {MODEL_ID} on {DEVICE}...")
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, use_fast=True)
    model = AutoModelForCausalLM.from_pretrained(MODEL_ID)
    
    # Move model to device (CPU or GPU)
    model = model.to(DEVICE)
    
    # Create text generation pipeline
    text_generator = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_length=MAX_LENGTH,
        temperature=TEMPERATURE,
        top_p=TOP_P,
        top_k=TOP_K,
        repetition_penalty=REPETITION_PENALTY,
        device=0 if DEVICE == "cuda" else -1  # -1 for CPU, 0 for first GPU
    )
    
    print(f"Model loaded successfully on {DEVICE}")
    return text_generator

def format_prompt(template_key, **kwargs):
    """
    Format a prompt using the template and provided arguments.
    
    Args:
        template_key: The key for the template to use
        **kwargs: The arguments to format the template with
    
    Returns:
        Formatted prompt string
    """
    if template_key not in TEMPLATES:
        raise ValueError(f"Unknown template: {template_key}")
    
    template = TEMPLATES[template_key]
    
    # Fill in template with provided kwargs
    # For any missing kwargs, use placeholders
    for key in [k[1:-1] for k in template.split('{')[1:]]:
        key = key.split('}')[0]
        if key not in kwargs:
            kwargs[key] = f"[No {key} provided]"
    
    return template.format(**kwargs)

def load_fine_tuned_model(model_path):
    """
    Load a fine-tuned model from the specified path.
    This would be used in production to load a model that has been fine-tuned on 
    spiritual/astrological data.
    
    Args:
        model_path: Path to the fine-tuned model
        
    Returns:
        A pipeline for text generation
    """
    if not os.path.exists(model_path):
        print(f"Fine-tuned model not found at {model_path}. Using base model.")
        return load_model()
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForCausalLM.from_pretrained(model_path)
        model = model.to(DEVICE)
        
        text_generator = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            max_length=MAX_LENGTH,
            temperature=TEMPERATURE,
            top_p=TOP_P,
            top_k=TOP_K,
            repetition_penalty=REPETITION_PENALTY,
            device=0 if DEVICE == "cuda" else -1
        )
        
        print(f"Fine-tuned model loaded successfully from {model_path}")
        return text_generator
    
    except Exception as e:
        print(f"Error loading fine-tuned model: {e}")
        print("Falling back to base model.")
        return load_model()
