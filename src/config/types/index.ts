export function isTelegramError(error: unknown): error is {
  response: {
    body: {
      error_code: number;
      description: string;
      parameters?: { retry_after?: number };
    };
  };
} {
  const body = (error as any)?.response?.body;
  return (
    typeof body?.error_code === "number" &&
    typeof body?.description === "string"
  );
}

export interface ICommandHandler {
  regex: RegExp;
  handler: (userId: number, match: RegExpExecArray | null) => Promise<void>;
}

export interface ICallbackData {
  action: string;
  param?: any;
}
