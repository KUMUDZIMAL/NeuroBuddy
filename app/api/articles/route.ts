import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.NHS_API_KEY) {
      throw new Error('NHS API key is not configured');
    }
const nhs_api_key = "1c6a3a901c3249d9b12405a8422b7df7";
    const response = await fetch('https://api.nhs.uk/mental-health', {
      headers: {
        'Accept': 'application/json',
        'apikey': nhs_api_key
      }
      
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch NHS content: ${response.status}`);
    }

    const data = await response.json();
    console.log('NHS API Response:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching NHS content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NHS content' },
      { status: 500 }
    );
  }
}
