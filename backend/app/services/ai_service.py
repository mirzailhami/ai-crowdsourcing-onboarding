# app/services/ai_service.py
import boto3
import os
import json
from dotenv import load_dotenv

load_dotenv()

bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1'
)

async def generate_rubric(challenge_description: str):
    response = bedrock_client.invoke_model(
        modelId='meta.llama3-70b-instruct-v1:0',
        body=json.dumps({
            "prompt": f"Generate an evaluation rubric for a challenge with description: {challenge_description}",
            "max_tokens": 500
        })
    )
    return json.loads(response["body"].read())["choices"][0]["text"]

async def recommend_prizes(challenge_type: str, participant_count: int):
    response = bedrock_client.invoke_model(
        modelId='meta.llama3-70b-instruct-v1:0',
        body=json.dumps({
            "prompt": f"Recommend prize amounts for a {challenge_type} challenge with {participant_count} participants",
            "max_tokens": 200
        })
    )
    return json.loads(response["body"].read())["choices"][0]["text"]

async def summarize_text(text: str):
    response = bedrock_client.invoke_model(
        modelId='meta.llama3-70b-instruct-v1:0',
        body=json.dumps({
            "prompt": f"Summarize the following text in 100 words or less: {text}",
            "max_tokens": 100
        })
    )
    return json.loads(response["body"].read())["choices"][0]["text"]

async def answer_question(step: int, prompt: str):
    response = bedrock_client.invoke_model(
        modelId='meta.llama3-70b-instruct-v1:0',
        body=json.dumps({
            "prompt": prompt,
            "max_tokens": 300
        })
    )
    return json.loads(response["body"].read())["choices"][0]["text"]