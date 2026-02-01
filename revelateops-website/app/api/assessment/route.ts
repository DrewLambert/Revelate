import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { lead, result, answers, submittedAt } = body;

    // Validate required fields
    if (!lead?.name || !lead?.email || !lead?.company || !result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const submission = {
      id: crypto.randomUUID(),
      lead,
      result: {
        overallScore: result.overallScore,
        tier: result.tier,
        dimensionScores: result.dimensionScores,
        recommendationCount: result.recommendations?.length || 0,
      },
      answers,
      submittedAt: submittedAt || new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Log to console for now (visible in Vercel logs)
    console.log('[Assessment Submission]', JSON.stringify(submission, null, 2));

    // In development, also write to a local file
    if (process.env.NODE_ENV === 'development') {
      try {
        const logDir = path.join(process.cwd(), 'data');
        await fs.mkdir(logDir, { recursive: true });
        const logFile = path.join(logDir, 'assessment-submissions.jsonl');
        await fs.appendFile(logFile, JSON.stringify(submission) + '\n');
      } catch (err) {
        console.warn('Could not write to local log file:', err);
      }
    }

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('[Assessment API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
