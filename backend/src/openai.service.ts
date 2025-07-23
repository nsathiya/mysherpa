import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { GeocodingService } from './geocoding.service';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly geocodingService: GeocodingService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSuggestions(activity: string, locationTime: string, price: string, adventureStyle: string, touristVibe: string, landscapePreferences: string[], paceOfDay: string): Promise<any[]> {
    const prompt = `
    You are a helpful concierge assistant. Based on the following user information, suggest 5-7 personalized activities.
    
    User Preferences:
    - Adventure Style: ${adventureStyle}
    - Tourist Vibe: ${touristVibe}
    - Preferred Landscapes: ${landscapePreferences && landscapePreferences.length > 0 ? landscapePreferences.join(", ") : "None specified"}
    - Adventure Pace: ${paceOfDay}
    
    Trip Context:
    - Activity/Interest: ${activity}
    - Location & Time: ${locationTime}
    - Price Preference: ${price}
    
    Please return suggestions in the following JSON format:
    [  
      {    
        "title": "Activity Name",
        "description": "Brief description of the activity",
        "cost": "Cheap/Moderate/High-end",
        "address": "Specific address or location (e.g., '123 Main St, New York, NY' or 'Central Park, New York, NY')",
        "website": "Website link to the activity",
        "whyRecommended": "Short explanation of why this fits the user's preferences",
        "estimatedTime": "Realistic time estimate (e.g., '2-3 hours', '30 minutes', 'Half day')"
        }
    ]
        
    Your suggestions should:
    - Match the user's preferences and explain why.
    - Include a short "whyRecommended" string for each activity that highlights how the activity aligns with the user's adventure style, tourist preference, landscape choices, and pace.
    - Provide realistic "estimatedTime" that considers the user's pace preference (chill = longer times, fast = shorter times).
    - Respect touristy preferences (e.g., avoid crowded attractions if they dislike tourist traps).
    - Prioritize the user's favorite landscapes (e.g., beaches, mountains).
    - Match their desired pace (e.g., no fast-paced activities for someone who prefers a chill day).
    - Be relevant to the location, time, and budget.
    - Be specific, realistic, and geocodable.
    
    Be creative and helpful — this user is relying on you to make their day amazing.`;

    console.log('prompt', prompt);
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful concierge assistant that provides personalized activity suggestions. Always respond with valid JSON in the exact format requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const response = completion.choices[0]?.message?.content;
      console.log('response', response);
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Clean the response to handle markdown code blocks
      let cleanedResponse = response.trim();
      
      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Parse the JSON response
      const suggestions = JSON.parse(cleanedResponse);
      
      // Validate the response format
      if (!Array.isArray(suggestions)) {
        throw new Error('Invalid response format from OpenAI');
      }

      // Add coordinates to suggestions using geocoding
      const suggestionsWithCoordinates = await this.geocodingService.addCoordinatesToSuggestions(suggestions);
      
      return suggestionsWithCoordinates;
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Return fallback suggestions if API fails
      return [
        {
          title: 'Local Cafe Visit',
          description: 'Enjoy a relaxing coffee or meal at a nearby cafe.',
          cost: price === 'cheap' ? 'Cheap' : price === 'high-end' ? 'High-end' : 'Moderate',
          address: locationTime.split(' at ')[0] || 'Local area',
          website: 'https://www.google.com',
          lat: 40.7128,
          lng: -74.0060
        },
        {
          title: 'Walking Tour',
          description: 'Explore the area on foot and discover hidden gems.',
          cost: 'Cheap',
          address: locationTime.split(' at ')[0] || 'Local area',
          website: 'https://www.google.com',
          lat: 40.7128,
          lng: -74.0060
        }
      ];
    }
  }
} 