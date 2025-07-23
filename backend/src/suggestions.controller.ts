import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { EmailService } from './email.service';

class SuggestionRequestDto {
  activity: string;
  locationTime: string;
  price: string;
  adventureStyle?: string;
  touristVibe?: string;
  landscapePreferences?: string[];
  paceOfDay?: string;
}

class EmailRequestDto {
  toEmail: string;
  fromEmail: string;
  suggestions: any[];
  activity: string;
  locationTime: string;
  price: string;
}

class SuggestionResponseDto {
  title: string;
  description: string;
  cost: string;
  address: string;
  website?: string;
  lat?: number;
  lng?: number;
}

class SuggestionFeedbackDto {
  suggestionTitle: string;
  rating: number; // 1-5 stars
  feedback?: string;
  userId: string;
}

@Controller('suggestions')
export class SuggestionsController {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly emailService: EmailService
  ) {}

  @Post()
  async getSuggestions(@Body() body: SuggestionRequestDto): Promise<SuggestionResponseDto[]> {
    return await this.openaiService.generateSuggestions(
      body.activity,
      body.locationTime,
      body.price,
      body.adventureStyle || '',
      body.touristVibe || '',
      body.landscapePreferences || [],
      body.paceOfDay || ''
    );
  }

  @Post('email')
  async sendEmail(@Body() body: EmailRequestDto): Promise<{ success: boolean; message: string }> {
    const success = await this.emailService.sendSuggestionsEmail(
      body.toEmail,
      body.fromEmail,
      body.suggestions,
      body.activity,
      body.locationTime,
      body.price
    );

    return {
      success,
      message: success ? 'Email sent successfully!' : 'Failed to send email. Please try again.'
    };
  }

  @Get('email-preview')
  async getEmailPreview(
    @Query('suggestions') suggestions: string,
    @Query('activity') activity: string,
    @Query('locationTime') locationTime: string,
    @Query('price') price: string
  ): Promise<{ preview: string }> {
    const suggestionsArray = JSON.parse(decodeURIComponent(suggestions));
    const preview = this.emailService.generateEmailPreview(
      suggestionsArray,
      activity,
      locationTime,
      price
    );

    return { preview };
  }

  @Post('feedback')
  async submitFeedback(@Body() body: SuggestionFeedbackDto): Promise<{ success: boolean; message: string }> {
    // For now, just log the feedback. In production, you'd store this in a database
    console.log('Suggestion Feedback:', {
      suggestion: body.suggestionTitle,
      rating: body.rating,
      feedback: body.feedback,
      userId: body.userId,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Thank you for your feedback!'
    };
  }
} 