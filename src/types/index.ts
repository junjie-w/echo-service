import type { IncomingHttpHeaders } from 'http';

export interface RequestEcho {
  headers: IncomingHttpHeaders;
  method: string;
  origin: string;
  uri: string;
  arguments: Record<string, unknown>;
  body: unknown;
  url: string;
  timestamp: string;
}

export interface ServerInfo {
  hostname: string;
  nodeVersion: string;
}

export interface ServiceInfo {
  sourceCode: string;
  version: string;
  environment: string;
}

export interface HealthCheckResponse {
  status: 'healthy';
  timestamp: string;
  uptime: number;
}

export interface TimedResponse<T> {
  data: T;
  processingTime: string;
}

export interface EchoResponseData {
  requestEcho: RequestEcho & {
    processingTime: string;
  };
  server: ServerInfo;
  serviceInfo: ServiceInfo;
}

export interface EchoResponse extends EchoResponseData {
  totalProcessingTime: string;
}

export interface ErrorResponse {
  error: {
    message: string;
    timestamp: string;
    requestId?: string;
    path?: string;
  };
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type LogLevel = 'info' | 'error' | 'warn';

export type LogPayload = string | Record<string, unknown>;

export type LoggerFunction = (payload: LogPayload) => void;
