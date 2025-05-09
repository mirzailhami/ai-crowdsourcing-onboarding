# Cost Coverage Report

## Services Used
- **Vercel (Frontend)**: Free tier (hobby plan, sufficient for Next.js deployment, up to 100GB bandwidth/month).
- **Docker Compose (Backend)**: Local FastAPI and PostgreSQL, no cloud cost.
- **AWS Bedrock (Claude 3.7 Sonnet)**: Pay-per-use with prompt caching (input tokens: ~$0.0035/1,000 for cache misses, ~$0.00035/1,000 for cache hits; output tokens: ~$0.0105/1,000).

## Estimated Monthly Costs
- **Vercel**: $0 (free tier, <100GB bandwidth).
- **Docker Compose**: $0 (local deployment).
- **Bedrock**:
  - Base cost (no caching): ~$14 (assuming 1M input tokens at $0.0035/1,000, 1M output tokens at $0.0105/1,000).
  - With prompt caching: ~$5–$7 (assuming 70% cache hit rate, reducing input token cost to ~$0.00105/1,000, plus 25% premium on cache writes).
- **Total**: ~$5–$7/month with caching optimization.

## Optimization Strategies
- **Prompt Caching**: Leverage Bedrock’s prompt caching (90% discount on input tokens for cache hits, 25% premium on cache writes) to reduce costs for repeated queries.
- **Monitor Token Usage**: Limit token-heavy prompts, targeting <1M input/output tokens/month.
- **Leverage Vercel Free Tier**: Ensure frontend stays within hobby plan limits.

## Pricing Reference
- Based on AWS Bedrock pricing (https://aws.amazon.com/bedrock/pricing/), effective May 2025, for `us.anthropic.claude-3-7-sonnet-20250219-v1:0`.