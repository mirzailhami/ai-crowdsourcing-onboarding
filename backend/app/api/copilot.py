from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import boto3
import json
import logging
import re
from typing import List, Dict, Optional, Any
from datetime import datetime

router = APIRouter(prefix="/copilot")

class CopilotRequest(BaseModel):
    messages: List[Dict[str, Any]]
    context: List[str]
    formData: Dict[str, Any]
    step: int

# Configure logging
logging.basicConfig(
    filename="/app/debug.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize Bedrock client
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1"
)

@router.post("", response_model=Dict)
async def copilot_chat(request: CopilotRequest):
    try:
        # Define step-specific instructions to make the Copilot smarter
        step_instructions = {
            1: "You are assisting with defining a challenge. Focus on creating clear, specific, and measurable goals, and ensure the challenge is well-scoped. Use the form data to tailor your suggestions.",
            2: "You are helping define the target audience for a challenge. Suggest strategies to reach the right participants, considering diversity, skills, and geographic factors.",
            3: "You are assisting with setting submission requirements. Provide clear and practical suggestions for formats, documentation, and instructions to ensure participants can submit effectively.",
            4: "You are helping design prizes and incentives. Suggest a balanced prize structure, considering budget, non-monetary rewards, and sponsorship opportunities.",
            5: "You are assisting with setting a timeline and milestones. Suggest a realistic schedule with clear deadlines and buffers to ensure the challenge runs smoothly.",
            6: "You are helping define evaluation criteria. Suggest fair and transparent criteria, judging processes, and methods to handle ties.",
            7: "You are assisting with success metrics and challenge management. Suggest key metrics, notification strategies, and dispute resolution methods to ensure the challenge is successful."
        }

        # Prepare system prompt (cacheable)
        system_prompt_parts = []

        # Add step-specific instruction
        instruction = step_instructions.get(request.step, "You are assisting with a challenge creation process.")
        system_prompt_parts.append({
            "type": "text",
            "text": instruction,
            "cache_control": {"type": "ephemeral"}
        })

        # Prepare messages list
        messages = []

        # Add formData as cacheable content if available
        if request.formData:
            # formData is already a dictionary, so iterate directly
            form_data_lines = []
            for key, value in request.formData.items():
                if value is None:
                    continue
                if isinstance(value, (list, dict)):
                    # Convert lists and dicts to JSON strings
                    form_data_lines.append(f"{key}: {json.dumps(value)}")
                else:
                    # Handle primitive types (str, bool, int, float)
                    form_data_lines.append(f"{key}: {str(value)}")
            if form_data_lines:
                messages.append({
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Form Data:\n" + "\n".join(form_data_lines), "cache_control": {"type": "ephemeral"}}
                    ]
                })

        # Add context as cacheable content
        if request.context:
            messages.append({
                "role": "user",
                "content": [
                    {"type": "text", "text": "Context: " + " ".join(request.context), "cache_control": {"type": "ephemeral"}}
                ]
            })

        # Add messages (non-cacheable, dynamic part)
        for msg in request.messages:
            messages.append({
                "role": msg.get('role'),
                "content": [{"type": "text", "text": str(msg.get('content'))}]
            })

        # Request for dynamic suggestions (non-cacheable), with length constraint
        messages.append({
            "role": "user",
            "content": [{"type": "text", "text": "Based on the above context and conversation, please provide 5 tailored suggestion tips as a JSON array of strings under the key 'suggestions' at the end of your response, e.g., {\"suggestions\": [\"Tip 1\", \"Tip 2\", \"Tip 3\", \"Tip 4\", \"Tip 5\"]}). Each suggestion must be concise, under 80 characters. Ensure the suggestions are relevant to the current step and conversation."}]
        })

        # Combine into final request body
        messages_api_body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 600,
            "system": system_prompt_parts,
            "messages": messages
        }
        
        logger.debug(f"Sending prompt to Bedrock: {json.dumps(messages_api_body, indent=2)}")

        # Call Bedrock model with Claude 3.7 Sonnet
        response = bedrock.invoke_model(
            modelId="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
            body=json.dumps(messages_api_body),
            contentType="application/json",
            accept="application/json"
        )

        logger.debug(f"Received response from Bedrock: {response}")

        # Parse the response
        response_body = json.loads(response['body'].read())
        logger.debug(f"Parsed response body: {response_body}")

        # Extract the generated text
        if "content" not in response_body or not response_body["content"]:
            logger.error(f"Unexpected response format from Bedrock: {response_body}")
            raise HTTPException(status_code=500, detail="Unexpected response format from Bedrock model")

        result = response_body["content"][0]["text"] if isinstance(response_body["content"][0], dict) else response_body["content"][0]

        # Extract suggestions if present
        suggestions_match = re.search(r'{\s*"suggestions"\s*:\s*\[\s*("[^"]*"(?:\s*,\s*"[^"]*")*\s*)\]\s*}', result, re.DOTALL)
        suggestions = []
        if suggestions_match:
            suggestions_str = suggestions_match.group(1)
            # Clean up the suggestions string: remove newlines and extra whitespace
            suggestions_str = suggestions_str.replace('\n', '').replace('\r', '')
            suggestions_str = re.sub(r'\s+', ' ', suggestions_str.strip())
            # Ensure proper JSON format by reconstructing the array
            try:
                # Parse the cleaned suggestions string as a JSON array
                suggestions_array = json.loads(f'[{suggestions_str}]')
                suggestions = suggestions_array
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse suggestions JSON: {str(e)}, raw string: {suggestions_str}")
                suggestions = []

        # Return the response with generated timestamps
        current_time = datetime.utcnow().isoformat() + "Z"
        return {
            "role": "assistant",
            "content": result.split("{")[0].strip(),
            "timestamp": current_time,
            "createdAt": current_time,
            "suggestions": suggestions
        }

    except HTTPException as e:
        logger.error(f"HTTP error in copilot endpoint: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in copilot endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process copilot request: {str(e)}")