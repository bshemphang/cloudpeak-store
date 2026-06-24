import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { level = 'INFO', message = '', meta = {} } = body;

    const cleanMeta = {
      ...meta,
      clientTelemetry: true,
      ip: req.headers.get('x-forwarded-for') || 'unknown',
    };

    if (level === 'ERROR') {
      logger.error(`[Client Telemetry Error] ${message}`, undefined, cleanMeta);
    } else if (level === 'WARN') {
      logger.warn(`[Client Telemetry Warn] ${message}`, cleanMeta);
    } else {
      logger.info(`[Client Telemetry Info] ${message}`, cleanMeta);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    logger.error('Failed to parse and write client telemetry log', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
