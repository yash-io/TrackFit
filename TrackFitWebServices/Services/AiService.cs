using Azure;
using Azure.AI.OpenAI;
using OpenAI.Chat;
using TrackFitWebServices.DTOs;

namespace TrackFitWebServices.Services
{
    public class AiService
    {
        private readonly ChatClient _chatClient;

        public AiService()
        {
            var endpoint = new Uri("Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT") ?? throw new InvalidOperationException("AZURE_OPENAI_ENDPOINT environment variable is not set."));
            var apiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY") ?? throw new InvalidOperationException("AZURE_OPENAI_API_KEY environment variable is not set.");
            var deploymentName = "gpt-5.4-mini";

            var azureClient = new AzureOpenAIClient(
                endpoint,
                new AzureKeyCredential(apiKey)
            );

            _chatClient = azureClient.GetChatClient(deploymentName);
        }

        public async Task<string?> GetFitnessReply(string userMessage, List<ChatTurnDto> history)
        {
            var systemPrompt =
                "You are a helpful fitness assistant for the TrackFit app. " +
                "You provide advice on workouts, nutrition, hydration, sleep, " +
                "goal setting, calorie tracking, and general health. " +
                "Keep responses concise, friendly, and motivating. " +
                "Always encourage healthy and safe fitness practices. " +
                "Return ONLY the fitness advice. Do NOT ask unrelated questions."+
                "Give me a walk through of the website";

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(systemPrompt)
            };

            foreach (var turn in history)
            {
                if (turn.Role == "user")
                    messages.Add(new UserChatMessage(turn.Content));
                else
                    messages.Add(new AssistantChatMessage(turn.Content));
            }

            messages.Add(new UserChatMessage(userMessage));

            var options = new ChatCompletionOptions
            {
                Temperature = 0.7f
            };

            try
            {
                var response = await _chatClient.CompleteChatAsync(messages, options);
                var reply = response.Value.Content[0].Text?.Trim();

                if (string.IsNullOrWhiteSpace(reply))
                    return null;

                return reply;
            }
            catch (Exception ex)
            {
                Console.WriteLine("AiService ERROR: " + ex.Message);
                return null;
            }
        }
    }
}