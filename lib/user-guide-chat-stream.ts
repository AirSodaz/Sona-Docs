export type UserGuideChatStreamEvent = {
  data: unknown;
  event: string;
};

export function parseUserGuideChatStreamEvents(input: string): {
  events: UserGuideChatStreamEvent[];
  remaining: string;
} {
  const normalized = input.replace(/\r\n/g, '\n');
  const blocks = normalized.split('\n\n');
  const remaining = blocks.pop() ?? '';
  const events = blocks.flatMap((block) => {
    let event = 'message';
    const dataLines: string[] = [];

    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice('event:'.length).trim();
        continue;
      }

      if (line.startsWith('data:')) {
        dataLines.push(line.slice('data:'.length).trimStart());
      }
    }

    if (dataLines.length === 0) {
      return [];
    }

    try {
      return [
        {
          data: JSON.parse(dataLines.join('\n')) as unknown,
          event,
        },
      ];
    } catch {
      return [];
    }
  });

  return {
    events,
    remaining,
  };
}
