## AI SDLC Rules
- This project follows an AI SDLC workflow.

Always begin by using the sdlc-orchestrator agent.

The sdlc-orchestrator is responsible for:
- Understanding the user's request
- Determining the current SDLC phase
- Delegating work to the appropriate specialized agent
- Validating completion before moving to the next phase

Do not invoke specialized agents directly unless explicitly requested by the user.